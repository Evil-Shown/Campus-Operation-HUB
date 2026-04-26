package com.campusops.campus_ops_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusops.campus_ops_backend.dto.request.UpdateUserRoleDTO;
import com.campusops.campus_ops_backend.dto.response.UserSummaryDTO;
import com.campusops.campus_ops_backend.service.UserAdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserAdminController {

    private final UserAdminService userAdminService;

    @GetMapping
    public ResponseEntity<List<UserSummaryDTO>> listUsers() {
        return ResponseEntity.ok(userAdminService.listUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserSummaryDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userAdminService.getUserById(id));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserSummaryDTO> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleDTO dto) {
        return ResponseEntity.ok(userAdminService.updateUserRole(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, Authentication authentication) {
        userAdminService.deleteUser(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
