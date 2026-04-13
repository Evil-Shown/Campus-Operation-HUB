package com.campusops.campus_ops_backend.dto.response;

import java.time.LocalTime;

import com.campusops.campus_ops_backend.model.Resource;

public record ResourceResponseDTO(
        Long id,
        String name,
        Resource.ResourceType type,
        Integer capacity,
        String location,
        Resource.ResourceStatus status,
        LocalTime availabilityStart,
        LocalTime availabilityEnd) {

    public static ResourceResponseDTO from(Resource r) {
        return new ResourceResponseDTO(
                r.getId(),
                r.getName(),
                r.getType(),
                r.getCapacity(),
                r.getLocation(),
                r.getStatus(),
                r.getAvailabilityStart(),
                r.getAvailabilityEnd());
    }
}