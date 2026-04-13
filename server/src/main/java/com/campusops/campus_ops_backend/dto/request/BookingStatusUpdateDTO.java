package com.campusops.campus_ops_backend.dto.request;

import com.campusops.campus_ops_backend.model.Booking;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingStatusUpdateDTO {

    @NotNull
    private Booking.BookingStatus status;

    private String rejectReason;
}