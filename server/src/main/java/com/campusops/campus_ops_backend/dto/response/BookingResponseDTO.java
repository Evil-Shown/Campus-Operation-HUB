package com.campusops.campus_ops_backend.dto.response;

import java.time.LocalDateTime;

import com.campusops.campus_ops_backend.model.Booking;

public record BookingResponseDTO(
        Long id,
        ResourceResponseDTO resource,
        UserSummaryDTO user,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String purpose,
        Integer attendees,
        Booking.BookingStatus status,
        String rejectReason,
        LocalDateTime createdAt) {

    public static BookingResponseDTO from(Booking b) {
        return new BookingResponseDTO(
                b.getId(),
                b.getResource() == null ? null : ResourceResponseDTO.from(b.getResource()),
                b.getUser() == null ? null : new UserSummaryDTO(
                        b.getUser().getId(),
                        b.getUser().getName(),
                        b.getUser().getEmail(),
                        b.getUser().getPictureUrl(),
                        b.getUser().getRole()),
                b.getStartTime(),
                b.getEndTime(),
                b.getPurpose(),
                b.getAttendees(),
                b.getStatus(),
                b.getRejectReason(),
                b.getCreatedAt());
    }
}