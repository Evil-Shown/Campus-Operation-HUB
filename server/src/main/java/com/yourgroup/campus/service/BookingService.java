package com.yourgroup.campus.service;

import com.yourgroup.campus.dto.BookingRequestDTO;
import com.yourgroup.campus.dto.BookingResponseDTO;
import com.campusops.campus_ops_backend.exception.ResourceNotFoundException;
import com.campusops.campus_ops_backend.model.Resource;
import com.campusops.campus_ops_backend.model.User;
import com.campusops.campus_ops_backend.repository.ResourceRepository;
import com.campusops.campus_ops_backend.repository.UserRepository;
import com.campusops.campus_ops_backend.service.NotificationService;
import com.yourgroup.campus.exception.BookingConflictException;
import com.yourgroup.campus.exception.BookingNotFoundException;
import com.yourgroup.campus.exception.UnauthorizedBookingAccessException;
import com.yourgroup.campus.model.Booking;
import com.yourgroup.campus.model.Booking.BookingStatus;
import com.yourgroup.campus.repository.BookingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BookingService {
    // Member 2 - Booking Management

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public BookingService(
            BookingRepository bookingRepository,
            ResourceRepository resourceRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    /**
     * Create a booking request in PENDING state after validating resource and conflicts.
     */
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO dto, Long userId) {
        if (!dto.getEndTime().isAfter(dto.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + dto.getResourceId()));
        if (resource.getStatus() != Resource.ResourceStatus.ACTIVE) {
            throw new IllegalStateException("Resource is not available for booking");
        }

        LocalDateTime requestedStart = LocalDateTime.of(dto.getBookingDate(), dto.getStartTime());
        LocalDateTime requestedEnd = LocalDateTime.of(dto.getBookingDate(), dto.getEndTime());

        // Lock resource row to serialize booking writes per resource and reduce race windows.
        resourceRepository.findByIdForUpdate(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + dto.getResourceId()));

        // Lock overlapping approved slots before insert to prevent concurrent overlaps.
        List<Booking> conflicts = bookingRepository.findApprovedConflictsForUpdate(
                dto.getResourceId(),
                dto.getBookingDate(),
                requestedStart,
                requestedEnd);
        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("This resource already has a booking in the selected time slot");
        }

        User user = findUserOrThrow(userId);
        Booking booking = Booking.builder()
                .user(user)
                .resource(resource)
                .startTime(requestedStart)
                .endTime(requestedEnd)
                .purpose(dto.getPurpose())
                .expectedAttendees(dto.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .build();

        log.info("Created booking request by user {}", userId);
        Booking saved = bookingRepository.save(booking);

        List<User> admins = userRepository.findByRole(User.Role.ADMIN);
        for (User adminUser : admins) {
            try {
                notificationService.create(
                        adminUser,
                        "BOOKING_PENDING_REVIEW",
                        "New booking request #" + saved.getId()
                                + " for " + resource.getName()
                                + " on " + saved.getStartTime().toLocalDate()
                                + " requires review.");
            } catch (Exception ex) {
                log.warn("Failed to notify admin {} about booking {}: {}", adminUser.getId(), saved.getId(), ex.getMessage());
            }
        }

        return toDTO(saved);
    }

    /**
     * Return bookings requested by a user.
     */
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByStartTimeDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Return all bookings with admin filters.
     */
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookings(BookingStatus status, LocalDate bookingDate, Long resourceId) {
        return bookingRepository.findAllByFilters(status, bookingDate, resourceId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Return a booking with role-based access check.
     */
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long bookingId, Long userId, String role) {
        Booking booking = findOrThrow(bookingId);
        if (!isAdmin(role) && !booking.getUser().getId().equals(userId)) {
            throw new UnauthorizedBookingAccessException("You are not allowed to access this booking");
        }
        return toDTO(booking);
    }

    /**
     * Return approved bookings for a specific resource.
     */
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getResourceBookings(Long resourceId) {
        return bookingRepository.findByResourceIdAndStatusOrderByStartTimeAsc(resourceId, BookingStatus.APPROVED)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Approve a PENDING booking and trigger notification.
     */
    @Transactional
    public BookingResponseDTO approveBooking(Long bookingId, String note, Long adminId, String role) {
        Booking booking = findOrThrow(bookingId);
        User admin = findUserOrThrow(adminId);
        if (!isAdmin(role)) {
            throw new UnauthorizedBookingAccessException("Only ADMIN users can review bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be approved");
        }

        // Lock resource row and approved overlapping candidates to make approval conflict check concurrency-safe.
        resourceRepository.findByIdForUpdate(booking.getResource().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + booking.getResource().getId()));

        List<Booking> conflicts = bookingRepository.findApprovedConflictsForUpdateExcluding(
                booking.getResource().getId(),
                booking.getStartTime().toLocalDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                bookingId
        );
        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("A conflicting booking was approved while this was pending");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setAdminReviewNote(note);
        Booking saved = bookingRepository.save(booking);

        try {
            notificationService.create(
                    booking.getUser(),
                    "BOOKING_APPROVED",
                    "Your booking for " + booking.getResource().getName() + " on " + booking.getStartTime().toLocalDate() + " has been approved.");
        } catch (DataAccessException ex) {
            // Keep booking workflow functional even if notification table is unavailable.
            log.warn("Failed to persist approval notification for booking {}: {}", bookingId, ex.getMessage());
        }

        log.info("Approved booking {} by admin {}", bookingId, adminId);
        return toDTO(saved);
    }

    /**
     * Reject a PENDING booking with mandatory reason and trigger notification.
     */
    @Transactional
    public BookingResponseDTO rejectBooking(Long bookingId, String reason, Long adminId, String role) {
        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("Rejection reason is required");
        }

        Booking booking = findOrThrow(bookingId);
        User admin = findUserOrThrow(adminId);
        if (!isAdmin(role)) {
            throw new UnauthorizedBookingAccessException("Only ADMIN users can review bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminReviewNote(reason);
        Booking saved = bookingRepository.save(booking);

        try {
            notificationService.create(
                    booking.getUser(),
                    "BOOKING_REJECTED",
                    "Your booking for " + booking.getResource().getName() + " was rejected. Reason: " + reason);
        } catch (DataAccessException ex) {
            // Keep booking workflow functional even if notification table is unavailable.
            log.warn("Failed to persist rejection notification for booking {}: {}", bookingId, ex.getMessage());
        }

        log.info("Rejected booking {} by admin {}", bookingId, adminId);
        return toDTO(saved);
    }

    /**
     * Cancel own booking (or any booking as admin) when state allows.
     */
    @Transactional
    public void cancelBooking(Long bookingId, Long userId) {
        Booking booking = findOrThrow(bookingId);
        User actor = findUserOrThrow(userId);

        if (!isAdmin(actor.getRole().name()) && !booking.getUser().getId().equals(userId)) {
            throw new UnauthorizedBookingAccessException("You can only cancel your own bookings");
        }
        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only PENDING or APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        log.info("Cancelled booking {} by user {}", bookingId, userId);
    }

    private Booking findOrThrow(Long id) {
        return bookingRepository.findById(id).orElseThrow(() -> new BookingNotFoundException(id));
    }

    private User findUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private boolean isAdmin(String role) {
        return "ADMIN".equalsIgnoreCase(role) || "ROLE_ADMIN".equalsIgnoreCase(role);
    }

    private BookingResponseDTO toDTO(Booking b) {
        return BookingResponseDTO.builder()
                .id(b.getId())
                .resourceId(b.getResource().getId())
                .resourceName(b.getResource().getName())
                .resourceLocation(b.getResource().getLocation())
                .userId(b.getUser().getId())
                .userName(b.getUser().getName())
                .bookingDate(b.getStartTime().toLocalDate())
                .startTime(b.getStartTime().toLocalTime())
                .endTime(b.getEndTime().toLocalTime())
                .purpose(b.getPurpose())
                .expectedAttendees(b.getExpectedAttendees())
                .status(b.getStatus())
                .adminReviewNote(b.getAdminReviewNote())
                .reviewedById(null)
                .reviewedByName(null)
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt() != null ? b.getUpdatedAt() : b.getCreatedAt())
                .build();
    }
}
