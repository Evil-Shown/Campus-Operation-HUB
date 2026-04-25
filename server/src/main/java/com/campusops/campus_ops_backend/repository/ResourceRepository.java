package com.campusops.campus_ops_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.campusops.campus_ops_backend.model.Resource;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    @Query("SELECT r FROM Resource r WHERE " +
            "(CAST(:type AS string) IS NULL OR r.type = :type) AND " +
            "(CAST(:location AS string) IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', CAST(:location AS string), '%'))) AND " +
            "(CAST(:minCapacity AS integer) IS NULL OR r.capacity >= :minCapacity) AND " +
            "r.status <> 'OUT_OF_SERVICE'")
    List<Resource> search(
            @Param("type") Resource.ResourceType type,
            @Param("location") String location,
            @Param("minCapacity") Integer minCapacity);
}














