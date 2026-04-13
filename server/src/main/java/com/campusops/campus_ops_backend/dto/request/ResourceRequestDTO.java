package com.campusops.campus_ops_backend.dto.request;

import java.time.LocalTime;

import com.campusops.campus_ops_backend.model.Resource;

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
    private Resource.ResourceType type;

    @Min(1)
    private Integer capacity;

    @NotBlank
    private String location;

    private Resource.ResourceStatus status;

    private LocalTime availabilityStart;
    private LocalTime availabilityEnd;
}