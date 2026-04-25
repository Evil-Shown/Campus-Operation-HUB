package com.yourgroup.campus.controller;

import com.yourgroup.campus.dto.BookingRequestDTO;
import com.yourgroup.campus.dto.BookingResponseDTO;
import com.yourgroup.campus.dto.BookingStatusUpdateDTO;
import com.yourgroup.campus.model.Booking.BookingStatus;
import com.yourgroup.campus.service.BookingService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.campusops.campus_ops_backend.security.UserPrincipal;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping({"/api/v1/bookings", "/api/bookings"})
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class BookingController {
    // Member 2 - Booking Management

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(dto, principal.getUser().getId()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.getUserBookings(principal.getUser().getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) Long resourceId) {
        return ResponseEntity.ok(bookingService.getAllBookings(status, date, resourceId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(
                bookingService.getBookingById(id, principal.getUser().getId(), principal.getUser().getRole().name()));
    }

    @GetMapping("/resource/{resourceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getResourceBookings(
            @PathVariable Long resourceId) {
        return ResponseEntity.ok(bookingService.getResourceBookings(resourceId));
    }

    @GetMapping("/resource/{resourceId}/availability")
    public ResponseEntity<List<BookingResponseDTO>> getAvailability(
            @PathVariable Long resourceId) {
        return ResponseEntity.ok(bookingService.getResourceBookings(resourceId));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> approveBooking(
            @PathVariable Long id,
            @RequestBody(required = false) BookingStatusUpdateDTO request,
            @AuthenticationPrincipal UserPrincipal principal) {
        String note = request != null ? request.getAdminReviewNote() : null;
        return ResponseEntity.ok(
                bookingService.approveBooking(id, note, principal.getUser().getId(), principal.getUser().getRole().name()));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> rejectBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateDTO request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(
                bookingService.rejectBooking(id, request.getAdminReviewNote(), principal.getUser().getId(), principal.getUser().getRole().name()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        bookingService.cancelBooking(id, principal.getUser().getId());
        return ResponseEntity.noContent().build();
    }
}
