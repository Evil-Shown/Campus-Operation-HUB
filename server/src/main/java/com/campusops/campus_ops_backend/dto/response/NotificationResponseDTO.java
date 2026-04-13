package com.campusops.campus_ops_backend.dto.response;

import java.time.LocalDateTime;

import com.campusops.campus_ops_backend.model.Notification;

public record NotificationResponseDTO(
        Long id,
        String type,
        String message,
        Boolean isRead,
        LocalDateTime createdAt) {

    public static NotificationResponseDTO from(Notification n) {
        return new NotificationResponseDTO(
                n.getId(),
                n.getType(),
                n.getMessage(),
                n.getIsRead(),
                n.getCreatedAt());
    }
}