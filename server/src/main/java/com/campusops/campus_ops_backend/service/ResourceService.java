/*package com.campusops.campus_ops_backend.service;

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
@SuppressWarnings("null")
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
*/


package com.campusops.campus_ops_backend.service;

import com.campusops.campus_ops_backend.model.Resource;
import com.campusops.campus_ops_backend.model.ResourceStatus;
import com.campusops.campus_ops_backend.model.ResourceType;
import com.campusops.campus_ops_backend.repository.ResourceRepository;
import com.campusops.campus_ops_backend.repository.ResourceSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository repository;

    public Resource createResource(Resource resource) {
        resource.setStatus(ResourceStatus.ACTIVE);
        return repository.save(resource);
    }

    public Resource updateResource(Long id, Resource updatedResource) {
        return repository.findById(id).map(resource -> {
            resource.setName(updatedResource.getName());
            resource.setType(updatedResource.getType());
            resource.setSeatingCapacity(updatedResource.getSeatingCapacity());
            resource.setPhysicalLocation(updatedResource.getPhysicalLocation());
            resource.setStatus(updatedResource.getStatus());
            resource.setAvailableFrom(updatedResource.getAvailableFrom());
            resource.setAvailableTo(updatedResource.getAvailableTo());
            return repository.save(resource);
        }).orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    public void softDeleteResource(Long id) {
        Resource resource = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        resource.setStatus(ResourceStatus.OUT_OF_SERVICE); 
        repository.save(resource);
    }

    public List<Resource> searchResources(ResourceType type, String location, Integer minCapacity) {
        Specification<Resource> spec = ResourceSpecification.filterResources(type, location, minCapacity, true);
        return repository.findAll(spec);
    }

    public List<Resource> getAllResourcesForAdmin() {
        return repository.findAll();
    }

    public Resource getResourceById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
    }
}