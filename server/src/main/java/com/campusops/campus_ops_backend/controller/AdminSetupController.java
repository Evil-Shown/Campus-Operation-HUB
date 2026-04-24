package com.campusops.campus_ops_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusops.campus_ops_backend.dto.request.SetupAdminDTO;
import com.campusops.campus_ops_backend.dto.response.AuthResponseDTO;
import com.campusops.campus_ops_backend.service.AdminSetupService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AdminSetupController {

    private final AdminSetupService adminSetupService;

    @PostMapping("/setup-admin")
    public ResponseEntity<AuthResponseDTO> setupAdmin(@Valid @RequestBody SetupAdminDTO dto) {
        try {
            AuthResponseDTO response = adminSetupService.setupAdmin(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AuthResponseDTO(null, null));
        }
    }
}
