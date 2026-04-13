package com.campusops.campus_ops_backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.campusops.campus_ops_backend.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
           "WHERE b.resource.id = :resourceId " +
           "AND b.status = 'APPROVED' " +
           "AND b.startTime < :endTime " +
           "AND b.endTime > :startTime")
    boolean existsConflict(
        @Param("resourceId") Long resourceId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime);

    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
           "WHERE b.resource.id = :resourceId " +
           "AND b.id <> :excludeId " +
           "AND b.status = 'APPROVED' " +
           "AND b.startTime < :endTime " +
           "AND b.endTime > :startTime")
    boolean existsConflictExcluding(
        @Param("resourceId") Long resourceId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime,
        @Param("excludeId") Long excludeId);

    List<Booking> findByUserId(Long userId);
    List<Booking> findByStatus(Booking.BookingStatus status);
    List<Booking> findByResourceId(Long resourceId);
}