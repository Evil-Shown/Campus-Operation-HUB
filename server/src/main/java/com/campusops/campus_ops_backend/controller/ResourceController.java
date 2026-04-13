package com.campusops.campus_ops_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campusops.campus_ops_backend.dto.request.ResourceRequestDTO;
import com.campusops.campus_ops_backend.dto.response.ResourceResponseDTO;
import com.campusops.campus_ops_backend.model.Resource;
import com.campusops.campus_ops_backend.service.ResourceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<ResourceResponseDTO>> search(
            @RequestParam(required = false) Resource.ResourceType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity) {
        return ResponseEntity.ok(resourceService.search(type, location, minCapacity));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> create(@Valid @RequestBody ResourceRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ResourceRequestDTO dto) {
        return ResponseEntity.ok(resourceService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resourceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
