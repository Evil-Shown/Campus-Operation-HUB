package com.campusops.campus_ops_backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusops.campus_ops_backend.dto.request.SigninRequestDTO;
import com.campusops.campus_ops_backend.dto.request.SignupRequestDTO;
import com.campusops.campus_ops_backend.dto.response.AuthResponseDTO;
import com.campusops.campus_ops_backend.dto.response.UserSummaryDTO;
import com.campusops.campus_ops_backend.security.UserPrincipal;
import com.campusops.campus_ops_backend.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/api/auth/signup")
    public ResponseEntity<AuthResponseDTO> signup(@Valid @RequestBody SignupRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @PostMapping("/api/auth/signin")
    public ResponseEntity<AuthResponseDTO> signin(@Valid @RequestBody SigninRequestDTO request) {
        return ResponseEntity.ok(authService.signin(request));
    }

    @GetMapping("/api/auth/me")
    public ResponseEntity<UserSummaryDTO> me(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(authService.getCurrentUser(principal.getUser().getId()).user());
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok", "service", "smart-campus-api"));
    }
}
