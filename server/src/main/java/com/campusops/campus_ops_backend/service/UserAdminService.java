package com.campusops.campus_ops_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campusops.campus_ops_backend.dto.request.UpdateUserRoleDTO;
import com.campusops.campus_ops_backend.dto.response.UserSummaryDTO;
import com.campusops.campus_ops_backend.exception.ResourceNotFoundException;
import com.campusops.campus_ops_backend.model.User;
import com.campusops.campus_ops_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserAdminService {

    private final UserRepository userRepository;

    @Transactional
    public UserSummaryDTO updateUserRole(Long userId, UpdateUserRoleDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        User.Role oldRole = user.getRole();
        user.setRole(dto.role());
        userRepository.save(user);

        log.info("User role updated: {} ({}) from {} to {}", 
                user.getEmail(), userId, oldRole, dto.role());

        return UserSummaryDTO.from(user);
    }

    @Transactional(readOnly = true)
    public UserSummaryDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return UserSummaryDTO.from(user);
    }
}
