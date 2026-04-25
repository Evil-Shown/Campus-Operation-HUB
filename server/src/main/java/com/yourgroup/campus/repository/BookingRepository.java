package com.yourgroup.campus.repository;

import com.yourgroup.campus.model.Booking;
import com.yourgroup.campus.model.Booking.BookingStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Member 2 - Booking Management

        /**
         * Find APPROVED bookings that overlap with the given time window.
         * Used during booking creation to detect conflicts.
         */
    @Query("""
            SELECT b FROM Booking b
            WHERE b.resource.id = :resourceId
              AND FUNCTION('DATE', b.startTime) = :bookingDate
              AND b.status = 'APPROVED'
              AND b.startTime < :endTime
              AND b.endTime > :startTime
            """)
    List<Booking> findConflictingBookings(
            @Param("resourceId") Long resourceId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

        /**
         * Find APPROVED bookings that overlap with the given time window,
         * excluding a specific booking by id.
         * Used during approval to re-check conflicts.
         */
    @Query("""
            SELECT b FROM Booking b
            WHERE b.resource.id = :resourceId
              AND FUNCTION('DATE', b.startTime) = :bookingDate
              AND b.status NOT IN ('REJECTED', 'CANCELLED')
              AND b.startTime < :endTime
              AND b.endTime > :startTime
              AND b.id <> :excludeId
            """)
    List<Booking> findConflictingBookingsExcluding(
            @Param("resourceId") Long resourceId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("excludeId") Long excludeId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT b FROM Booking b
            WHERE b.resource.id = :resourceId
              AND FUNCTION('DATE', b.startTime) = :bookingDate
              AND b.status = 'APPROVED'
              AND b.startTime < :endTime
              AND b.endTime > :startTime
            """)
    List<Booking> findApprovedConflictsForUpdate(
            @Param("resourceId") Long resourceId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT b FROM Booking b
            WHERE b.resource.id = :resourceId
              AND FUNCTION('DATE', b.startTime) = :bookingDate
              AND b.status = 'APPROVED'
              AND b.startTime < :endTime
              AND b.endTime > :startTime
              AND b.id <> :excludeId
            """)
    List<Booking> findApprovedConflictsForUpdateExcluding(
            @Param("resourceId") Long resourceId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("excludeId") Long excludeId);

        /**
         * Return all bookings, optionally filtered by status, ordered by createdAt
         * DESC.
         */
    @Query("""
            SELECT b FROM Booking b
            WHERE (:status IS NULL OR b.status = :status)
              AND (:bookingDate IS NULL OR FUNCTION('DATE', b.startTime) = :bookingDate)
              AND (:resourceId IS NULL OR b.resource.id = :resourceId)
            ORDER BY b.startTime DESC
            """)
    List<Booking> findAllByFilters(
            @Param("status") BookingStatus status,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("resourceId") Long resourceId);

        /**
         * Derived query: all bookings for a user, newest first by startTime.
         */
    List<Booking> findByUserIdOrderByStartTimeDesc(Long userId);

        /**
         * Derived query: bookings for a resource with given status, ordered by
         * startTime ASC.
         */
    List<Booking> findByResourceIdAndStatusOrderByStartTimeAsc(Long resourceId, BookingStatus status);
}
