package com.yourgroup.campus.service;

import com.campusops.campus_ops_backend.exception.ResourceNotFoundException;
import com.campusops.campus_ops_backend.model.Resource;
import com.campusops.campus_ops_backend.model.User;
import com.campusops.campus_ops_backend.repository.ResourceRepository;
import com.campusops.campus_ops_backend.repository.UserRepository;
import com.campusops.campus_ops_backend.service.NotificationService;
import com.yourgroup.campus.dto.BookingRequestDTO;
import com.yourgroup.campus.dto.BookingResponseDTO;
import com.yourgroup.campus.exception.BookingConflictException;
import com.yourgroup.campus.exception.BookingNotFoundException;
import com.yourgroup.campus.exception.UnauthorizedException;
import com.yourgroup.campus.model.Booking;
import com.yourgroup.campus.model.Booking.BookingStatus;
import com.yourgroup.campus.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

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

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                dto.getResourceId(),
                dto.getStartTime(),
                dto.getEndTime(),
                BookingStatus.APPROVED
        );
        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "This resource is already booked from "
                            + conflicts.get(0).getStartTime()
                            + " to "
                            + conflicts.get(0).getEndTime()
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String normalizedPurpose = dto.getPurpose() == null ? "" : dto.getPurpose().trim();

        Booking booking = Booking.builder()
                .user(user)
                .resource(resource)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(normalizedPurpose)
                .attendees(dto.getAttendees())
                .status(BookingStatus.PENDING)
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return toDTO(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getMyBookings(Long userId) {
        return bookingRepository.findByUser_IdOrderByStartTimeDesc(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookings(BookingStatus status) {
        return bookingRepository.findAllByStatusOrAll(status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long bookingId, Long userId) {
        Booking booking = findOrThrow(bookingId);
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        boolean isOwner = booking.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not allowed to view this booking");
        }
        return toDTO(booking);
    }

    @Transactional
    public BookingResponseDTO approveBooking(Long bookingId) {
        Booking booking = findOrThrow(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be approved");
        }

        List<Booking> conflicts = bookingRepository.findConflictingBookingsExcluding(
                booking.getResource().getId(),
                booking.getStartTime(),
                booking.getEndTime(),
                bookingId,
                BookingStatus.APPROVED
        );
        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "A conflicting booking was approved while this was pending"
            );
        }

        booking.setStatus(BookingStatus.APPROVED);
        Booking savedBooking = bookingRepository.save(booking);

        notificationService.create(
                booking.getUser(),
                "BOOKING_APPROVED",
                "Your booking for "
                        + booking.getResource().getName()
                        + " has been approved."
        );

        return toDTO(savedBooking);
    }

    @Transactional
    public BookingResponseDTO rejectBooking(Long bookingId, String reason) {
        Booking booking = findOrThrow(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectReason(reason);
        Booking savedBooking = bookingRepository.save(booking);

        notificationService.create(
                booking.getUser(),
                "BOOKING_REJECTED",
                "Your booking for "
                        + booking.getResource().getName()
                        + " was rejected."
                        + (reason != null && !reason.isBlank() ? " Reason: " + reason : "")
        );

        return toDTO(savedBooking);
    }

    @Transactional
    public BookingResponseDTO cancelBooking(Long bookingId, Long userId) {
        Booking booking = findOrThrow(bookingId);

        if (!booking.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only cancel your own bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only PENDING or APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking savedBooking = bookingRepository.save(booking);
        return toDTO(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getApprovedBookingsForResource(Long resourceId) {
        return bookingRepository.findByResourceIdAndStatusOrderByStartTime(resourceId, BookingStatus.APPROVED).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private Booking findOrThrow(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException(id));
    }

    private BookingResponseDTO toDTO(Booking b) {
        return BookingResponseDTO.builder()
                .id(b.getId())
                .resourceId(b.getResource().getId())
                .resourceName(b.getResource().getName())
                .resourceLocation(b.getResource().getLocation())
                .userId(b.getUser().getId())
                .userName(b.getUser().getName())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .purpose(b.getPurpose())
                .attendees(b.getAttendees())
                .status(b.getStatus())
                .rejectReason(b.getRejectReason())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
