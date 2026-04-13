package com.campusops.campus_ops_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campusops.campus_ops_backend.dto.response.AuthResponseDTO;
import com.campusops.campus_ops_backend.dto.response.UserSummaryDTO;
import com.campusops.campus_ops_backend.exception.ResourceNotFoundException;
import com.campusops.campus_ops_backend.model.User;
import com.campusops.campus_ops_backend.repository.UserRepository;
import com.campusops.campus_ops_backend.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional(readOnly = true)
    public AuthResponseDTO getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return new AuthResponseDTO(null, UserSummaryDTO.from(user));
    }
}
