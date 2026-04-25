package com.campusops.campus_ops_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campusops.campus_ops_backend.dto.request.BookingRequestDTO;
import com.campusops.campus_ops_backend.dto.response.BookingResponseDTO;
import com.campusops.campus_ops_backend.exception.BookingConflictException;
import com.campusops.campus_ops_backend.exception.ResourceNotFoundException;
import com.campusops.campus_ops_backend.exception.UnauthorizedActionException;
import com.campusops.campus_ops_backend.model.Booking;
import com.campusops.campus_ops_backend.model.Resource;
import com.campusops.campus_ops_backend.model.ResourceStatus;
import com.campusops.campus_ops_backend.model.User;
import com.campusops.campus_ops_backend.repository.BookingRepository;
import com.campusops.campus_ops_backend.repository.ResourceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO dto, User currentUser) {
        if (dto.getStartTime().isAfter(dto.getEndTime()) || dto.getStartTime().isEqual(dto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + dto.getResourceId()));

        if (resource.getStatus() != ResourceStatus.ACTIVE) {
            throw new IllegalStateException("Resource is out of service");
        }

        if (bookingRepository.existsConflict(resource.getId(), dto.getStartTime(), dto.getEndTime())) {
            throw new BookingConflictException("Resource is already booked for this time slot");
        }

        Booking booking = Booking.builder()
                .user(currentUser)
                .resource(resource)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(dto.getPurpose())
                .attendees(dto.getAttendees())
                .status(Booking.BookingStatus.PENDING)
                .build();

        return BookingResponseDTO.from(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getMyBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream().map(BookingResponseDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookings(Booking.BookingStatus status) {
        return (status == null ? bookingRepository.findAll() : bookingRepository.findByStatus(status)).stream()
                .map(BookingResponseDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponseDTO getById(Long id) {
        return BookingResponseDTO.from(findBooking(id));
    }

    @Transactional
    public BookingResponseDTO approve(Long bookingId, User admin) {
        Booking booking = findBooking(bookingId);
        booking.setStatus(Booking.BookingStatus.APPROVED);
        Booking saved = bookingRepository.save(booking);
        notificationService.create(saved.getUser(), "BOOKING_APPROVED",
                "Your booking for " + saved.getResource().getName() + " on " + saved.getStartTime().toLocalDate() + " has been approved.");
        return BookingResponseDTO.from(saved);
    }

    @Transactional
    public BookingResponseDTO reject(Long bookingId, String reason, User admin) {
        Booking booking = findBooking(bookingId);
        booking.setStatus(Booking.BookingStatus.REJECTED);
        booking.setRejectReason(reason);
        Booking saved = bookingRepository.save(booking);
        notificationService.create(saved.getUser(), "BOOKING_REJECTED",
                "Your booking was rejected. Reason: " + reason);
        return BookingResponseDTO.from(saved);
    }

    @Transactional
    public BookingResponseDTO cancel(Long bookingId, User currentUser) {
        Booking booking = findBooking(bookingId);
        if (!booking.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedActionException("You are not allowed to cancel this booking");
        }
        if (booking.getStatus() == Booking.BookingStatus.REJECTED || booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking cannot be cancelled in its current state");
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        return BookingResponseDTO.from(bookingRepository.save(booking));
    }

    private Booking findBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }
}
