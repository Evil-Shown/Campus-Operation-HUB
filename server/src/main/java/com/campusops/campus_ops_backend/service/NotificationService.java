package com.campusops.campus_ops_backend.service;

import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campusops.campus_ops_backend.dto.response.NotificationResponseDTO;
import com.campusops.campus_ops_backend.exception.ResourceNotFoundException;
import com.campusops.campus_ops_backend.exception.UnauthorizedActionException;
import com.campusops.campus_ops_backend.model.Notification;
import com.campusops.campus_ops_backend.model.User;
import com.campusops.campus_ops_backend.repository.NotificationRepository;
import com.campusops.campus_ops_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void create(User user, String type, String message) {
        try {
            notificationRepository.save(Notification.builder()
                    .user(user)
                    .type(type)
                    .message(message)
                    .isRead(false)
                    .build());
        } catch (DataAccessException ex) {
            log.warn("Failed to create notification for user {}: {}", user.getId(), ex.getMessage());
        }
    }

    public List<NotificationResponseDTO> getForUser(Long userId) {
        try {
            return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                    .map(NotificationResponseDTO::from)
                    .toList();
        } catch (DataAccessException ex) {
            log.warn("Failed to load notifications for user {}: {}", userId, ex.getMessage());
            return List.of();
        }
    }

    public long countUnread(Long userId) {
        try {
            return notificationRepository.countByUserIdAndIsReadFalse(userId);
        } catch (DataAccessException ex) {
            log.warn("Failed to count unread notifications for user {}: {}", userId, ex.getMessage());
            return 0L;
        }
    }

    @Transactional
    public void markAllRead(Long userId) {
        try {
            notificationRepository.markAllReadByUserId(userId);
        } catch (DataAccessException ex) {
            log.warn("Failed to mark all notifications read for user {}: {}", userId, ex.getMessage());
        }
    }

    @Transactional
    public void markOneRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));
        if (!notification.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You are not allowed to modify this notification");
        }
        try {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        } catch (DataAccessException ex) {
            log.warn("Failed to mark notification {} as read for user {}: {}", notificationId, userId, ex.getMessage());
        }
    }
}
