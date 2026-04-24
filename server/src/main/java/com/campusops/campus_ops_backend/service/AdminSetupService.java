package com.campusops.campus_ops_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.campusops.campus_ops_backend.dto.request.SetupAdminDTO;
import com.campusops.campus_ops_backend.dto.response.AuthResponseDTO;
import com.campusops.campus_ops_backend.dto.response.UserSummaryDTO;
import com.campusops.campus_ops_backend.model.User;
import com.campusops.campus_ops_backend.repository.UserRepository;
import com.campusops.campus_ops_backend.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminSetupService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponseDTO setupAdmin(SetupAdminDTO dto) {
        String normalizedEmail = dto.email().trim().toLowerCase();

        // Allow recovery when the same admin email is used; block creating a second distinct admin.
        User existingAdmin = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.ADMIN)
                .findFirst()
                .orElse(null);

        if (existingAdmin != null && !existingAdmin.getEmail().equalsIgnoreCase(normalizedEmail)) {
            throw new IllegalStateException("Admin user already exists. Setup is disabled.");
        }

        // Create or update user
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseGet(() -> User.builder()
                        .email(normalizedEmail)
                        .name(dto.name() != null ? dto.name() : "Administrator")
                        .build());

        user.setPasswordHash(passwordEncoder.encode(dto.password()));
        user.setRole(User.Role.ADMIN);
        userRepository.save(user);

        log.info("Admin user created/updated: {}", normalizedEmail);

        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponseDTO(token, UserSummaryDTO.from(user));
    }
}
