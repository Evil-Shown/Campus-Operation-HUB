package com.campusops.campus_ops_backend.dto.request;

import java.time.LocalTime;

import com.campusops.campus_ops_backend.model.ResourceStatus;
import com.campusops.campus_ops_backend.model.ResourceType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceRequestDTO {

    @NotBlank
    private String name;

    @NotNull
    private ResourceType type;

    @Min(1)
    private Integer seatingCapacity;

    @NotBlank
    private String physicalLocation;

    private ResourceStatus status;

    private LocalTime availableFrom;
    private LocalTime availableTo;
}