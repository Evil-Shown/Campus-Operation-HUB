package com.campusops.campus_ops_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.campusops.campus_ops_backend.model.Resource;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:location IS NULL OR LOWER(r.location) LIKE CONCAT('%', LOWER(CAST(:location AS string)), '%')) AND " +
           "(:minCapacity IS NULL OR r.capacity >= :minCapacity) AND " +
           "r.status <> 'OUT_OF_SERVICE'")
    List<Resource> search(
        @Param("type") Resource.ResourceType type,
        @Param("location") String location,
        @Param("minCapacity") Integer minCapacity);
}