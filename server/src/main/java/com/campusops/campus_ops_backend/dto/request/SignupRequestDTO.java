package com.campusops.campus_ops_backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequestDTO(
        @NotBlank(message = "name is required")
        @Size(min = 2, max = 100, message = "name must be between 2 and 100 characters")
        String name,

        @NotBlank(message = "email is required")
        @Email(message = "email must be valid")
        String email,

        @NotBlank(message = "password is required")
        @Size(min = 6, max = 128, message = "password must be between 6 and 128 characters")
        String password) {
}
