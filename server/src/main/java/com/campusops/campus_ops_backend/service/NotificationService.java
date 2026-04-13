package com.campusops.campus_ops_backend.service;

import java.util.List;

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

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void create(User user, String type, String message) {
        notificationRepository.save(Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .isRead(false)
                .build());
    }

    @Transactional(readOnly = true)
    public List<NotificationResponseDTO> getForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationResponseDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public long countUnread(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAllRead(Long userId) {
        notificationRepository.markAllReadByUserId(userId);
    }

    @Transactional
    public void markOneRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));
        if (!notification.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You are not allowed to modify this notification");
        }
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}
