package com.campusops.campus_ops_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campusops.campus_ops_backend.dto.request.ResourceRequestDTO;
import com.campusops.campus_ops_backend.dto.response.ResourceResponseDTO;
import com.campusops.campus_ops_backend.exception.ResourceNotFoundException;
import com.campusops.campus_ops_backend.model.Resource;
import com.campusops.campus_ops_backend.repository.ResourceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public List<ResourceResponseDTO> search(Resource.ResourceType type, String location, Integer minCapacity) {
        return resourceRepository.search(type, location, minCapacity).stream()
                .map(ResourceResponseDTO::from)
                .toList();
    }

    public ResourceResponseDTO getById(Long id) {
        return ResourceResponseDTO.from(findResource(id));
    }

    @Transactional
    public ResourceResponseDTO create(ResourceRequestDTO dto) {
        Resource resource = Resource.builder()
                .name(dto.getName())
                .type(dto.getType())
                .capacity(dto.getCapacity())
                .location(dto.getLocation())
                .status(dto.getStatus() == null ? Resource.ResourceStatus.ACTIVE : dto.getStatus())
                .availabilityStart(dto.getAvailabilityStart())
                .availabilityEnd(dto.getAvailabilityEnd())
                .build();
        return ResourceResponseDTO.from(resourceRepository.save(resource));
    }

    @Transactional
    public ResourceResponseDTO update(Long id, ResourceRequestDTO dto) {
        Resource resource = findResource(id);
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setStatus(dto.getStatus() == null ? resource.getStatus() : dto.getStatus());
        resource.setAvailabilityStart(dto.getAvailabilityStart());
        resource.setAvailabilityEnd(dto.getAvailabilityEnd());
        return ResourceResponseDTO.from(resourceRepository.save(resource));
    }

    @Transactional
    public void delete(Long id) {
        Resource resource = findResource(id);
        resource.setStatus(Resource.ResourceStatus.OUT_OF_SERVICE);
        resourceRepository.save(resource);
    }

    private Resource findResource(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }
}
