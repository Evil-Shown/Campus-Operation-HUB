package com.yourgroup.campus.dto;

import com.yourgroup.campus.model.Booking;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponseDTO {
    private Long id;
    private Long resourceId;
    private String resourceName;
    private String resourceLocation;
    private Long userId;
    private String userName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private Integer attendees;
    private Booking.BookingStatus status;
    private String rejectReason;
    private LocalDateTime createdAt;
}
