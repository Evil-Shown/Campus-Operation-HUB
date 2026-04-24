package com.campusops.campus_ops_backend.dto.request;

import com.campusops.campus_ops_backend.model.User;

import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleDTO(
        @NotNull(message = "Role is required")
        User.Role role) {
}
