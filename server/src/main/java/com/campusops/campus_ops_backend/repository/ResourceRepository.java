/*package com.campusops.campus_ops_backend.repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.campusops.campus_ops_backend.model.Resource;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Resource r WHERE r.id = :id")
    Optional<Resource> findByIdForUpdate(@Param("id") Long id);

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
*/



package com.campusops.campus_ops_backend.repository;

import com.campusops.campus_ops_backend.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long>, JpaSpecificationExecutor<Resource> {
}









