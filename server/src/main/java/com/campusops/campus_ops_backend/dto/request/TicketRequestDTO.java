package com.campusops.campus_ops_backend.dto.request;

import com.campusops.campus_ops_backend.model.Ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketRequestDTO {

    private Long resourceId;

    @NotBlank
    @Size(max = 255)
    private String resourceLocation;

    @NotNull
    private Ticket.TicketCategory category;

    @NotBlank
    @Size(min = 10)
    private String description;

    @NotNull
    private Ticket.TicketPriority priority;

    @NotBlank
    private String contactInfo;
}