package com.yourgroup.campus.repository;

import com.yourgroup.campus.model.Booking;
import com.yourgroup.campus.model.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
            SELECT b FROM Booking b
            WHERE b.resource.id = :resourceId
              AND b.status = :approved
              AND b.startTime < :endTime
              AND b.endTime > :startTime
            """)
    List<Booking> findConflictingBookings(
            @Param("resourceId") Long resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("approved") BookingStatus approved
    );

    @Query("""
            SELECT b FROM Booking b
            WHERE b.resource.id = :resourceId
              AND b.status = :approved
              AND b.startTime < :endTime
              AND b.endTime > :startTime
              AND b.id <> :excludeId
            """)
    List<Booking> findConflictingBookingsExcluding(
            @Param("resourceId") Long resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("excludeId") Long excludeId,
            @Param("approved") BookingStatus approved
    );

    List<Booking> findByUser_IdOrderByStartTimeDesc(Long userId);

    List<Booking> findByResourceIdAndStatusOrderByStartTime(Long resourceId, BookingStatus status);

    List<Booking> findByStatusOrderByCreatedAtAsc(BookingStatus status);

    @Query("""
            SELECT b FROM Booking b
            WHERE (:status IS NULL OR b.status = :status)
            ORDER BY b.createdAt DESC
            """)
    List<Booking> findAllByStatusOrAll(@Param("status") BookingStatus status);
}
