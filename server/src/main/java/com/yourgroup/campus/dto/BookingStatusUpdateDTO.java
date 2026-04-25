package com.yourgroup.campus.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BookingStatusUpdateDTO {
    // Member 2 - Booking Management

    @NotBlank(message = "Admin review note is required")
    private String adminReviewNote;
}
