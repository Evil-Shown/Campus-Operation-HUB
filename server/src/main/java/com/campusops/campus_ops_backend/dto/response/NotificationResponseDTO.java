package com.campusops.campus_ops_backend.dto.response;

import java.time.LocalDateTime;

import com.campusops.campus_ops_backend.model.Notification;

public record NotificationResponseDTO(
        Long id,
        String type,
        String title,
        String message,
        Boolean isRead,
        Boolean read,
        LocalDateTime createdAt) {

    public static NotificationResponseDTO from(Notification n) {
        String title = switch (n.getType()) {
            case "BOOKING_PENDING_REVIEW" -> "Booking needs review";
            case "BOOKING_APPROVED" -> "Booking approved";
            case "BOOKING_REJECTED" -> "Booking rejected";
            case "TICKET_CREATED" -> "New ticket created";
            case "TICKET_ASSIGNED" -> "Ticket assigned";
            case "TICKET_STATUS_CHANGED" -> "Ticket status updated";
            case "TICKET_COMMENT_ADDED" -> "New ticket comment";
            default -> "Notification";
        };
        return new NotificationResponseDTO(
                n.getId(),
                n.getType(),
                title,
                n.getMessage(),
                n.getIsRead(),
                n.getIsRead(),
                n.getCreatedAt());
    }
}