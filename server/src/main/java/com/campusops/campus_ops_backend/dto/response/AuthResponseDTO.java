package com.campusops.campus_ops_backend.dto.response;

public record AuthResponseDTO(String token, String tokenType, UserSummaryDTO user) {

    public AuthResponseDTO(String token, UserSummaryDTO user) {
        this(token, "Bearer", user);
    }
}