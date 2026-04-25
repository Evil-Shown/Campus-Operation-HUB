package com.campusops.campus_ops_backend.service;

import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campusops.campus_ops_backend.dto.response.NotificationResponseDTO;
import com.campusops.campus_ops_backend.exception.ResourceNotFoundException;
import com.campusops.campus_ops_backend.exception.UnauthorizedActionException;
import com.campusops.campus_ops_backend.model.Notification;
import com.campusops.campus_ops_backend.model.User;
import com.campusops.campus_ops_backend.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final JdbcTemplate jdbcTemplate;
    private volatile Boolean notificationsTableAvailable;

    public void create(User user, String type, String message) {
        if (!isNotificationsTableAvailable()) {
            return;
        }
        try {
            notificationRepository.save(Notification.builder()
                    .user(user)
                    .type(type)
                    .message(message)
                    .isRead(false)
                    .build());
        } catch (DataAccessException ex) {
            notificationsTableAvailable = false;
            log.warn("Failed to create notification for user {}: {}", user.getId(), ex.getMessage());
        }
    }

    public List<NotificationResponseDTO> getForUser(Long userId) {
        if (!isNotificationsTableAvailable()) {
            return List.of();
        }
        try {
            return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                    .map(NotificationResponseDTO::from)
                    .toList();
        } catch (DataAccessException ex) {
            notificationsTableAvailable = false;
            log.warn("Failed to load notifications for user {}: {}", userId, ex.getMessage());
            return List.of();
        }
    }

    public long countUnread(Long userId) {
        if (!isNotificationsTableAvailable()) {
            return 0L;
        }
        try {
            return notificationRepository.countByUserIdAndIsReadFalse(userId);
        } catch (DataAccessException ex) {
            notificationsTableAvailable = false;
            log.warn("Failed to count unread notifications for user {}: {}", userId, ex.getMessage());
            return 0L;
        }
    }

    @Transactional
    public void markAllRead(Long userId) {
        if (!isNotificationsTableAvailable()) {
            return;
        }
        try {
            notificationRepository.markAllReadByUserId(userId);
        } catch (DataAccessException ex) {
            notificationsTableAvailable = false;
            log.warn("Failed to mark all notifications read for user {}: {}", userId, ex.getMessage());
        }
    }

    @Transactional
    public void markOneRead(Long notificationId, Long userId) {
        if (!isNotificationsTableAvailable()) {
            return;
        }
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));
        if (!notification.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You are not allowed to modify this notification");
        }
        try {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        } catch (DataAccessException ex) {
            notificationsTableAvailable = false;
            log.warn("Failed to mark notification {} as read for user {}: {}", notificationId, userId, ex.getMessage());
        }
    }

    private boolean isNotificationsTableAvailable() {
        if (notificationsTableAvailable != null) {
            return notificationsTableAvailable;
        }
        try {
            String relationName = jdbcTemplate.queryForObject(
                    "SELECT to_regclass('public.notifications')",
                    String.class);
            notificationsTableAvailable = relationName != null;
            if (!notificationsTableAvailable) {
                log.warn("Notifications table not found; notification features are running in no-op mode.");
            }
            return notificationsTableAvailable;
        } catch (Exception ex) {
            notificationsTableAvailable = false;
            log.warn("Unable to verify notifications table availability: {}", ex.getMessage());
            return false;
        }
    }
}
