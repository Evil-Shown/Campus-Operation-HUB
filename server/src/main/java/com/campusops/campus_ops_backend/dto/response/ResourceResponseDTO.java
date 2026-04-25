package com.campusops.campus_ops_backend.dto.response;

import java.time.LocalTime;

import com.campusops.campus_ops_backend.model.Resource;
import com.campusops.campus_ops_backend.model.ResourceStatus;
import com.campusops.campus_ops_backend.model.ResourceType;

public record ResourceResponseDTO(
        Long id,
        String name,
        ResourceType type,
        Integer seatingCapacity,
        String physicalLocation,
        ResourceStatus status,
        LocalTime availableFrom,
        LocalTime availableTo) {

    public static ResourceResponseDTO from(Resource r) {
        return new ResourceResponseDTO(
                r.getId(),
                r.getName(),
                r.getType(),
                r.getSeatingCapacity(),
                r.getPhysicalLocation(),
                r.getStatus(),
                r.getAvailableFrom(),
                r.getAvailableTo());
    }
}