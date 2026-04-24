package com.campusops.campus_ops_backend.dto.request;

public record SetupAdminDTO(
        String email,
        String name,
        String password) {
}
