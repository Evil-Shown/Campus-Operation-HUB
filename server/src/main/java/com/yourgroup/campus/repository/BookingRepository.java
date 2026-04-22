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

        /**
         * Find APPROVED bookings that overlap with the given time window.
         * Used during booking creation to detect conflicts.
         */
        @Query("""
                        SELECT b FROM Booking b
                        WHERE b.resource.id = :resourceId
                          AND b.status = com.yourgroup.campus.model.Booking.BookingStatus.APPROVED
                          AND b.startTime < :endTime
                          AND b.endTime > :startTime
                        """)
        List<Booking> findConflictingBookings(
                        @Param("resourceId") Long resourceId,
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
                          AND b.status = com.yourgroup.campus.model.Booking.BookingStatus.APPROVED
                          AND b.startTime < :endTime
                          AND b.endTime > :startTime
                          AND b.id <> :excludeId
                        """)
        List<Booking> findConflictingBookingsExcluding(
                        @Param("resourceId") Long resourceId,
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
                        ORDER BY b.createdAt DESC
                        """)
        List<Booking> findAllWithOptionalStatus(@Param("status") BookingStatus status);

        /**
         * Derived query: all bookings for a user, newest first by startTime.
         */
        List<Booking> findByUserIdOrderByStartTimeDesc(Long userId);

        /**
         * Derived query: bookings for a resource with given status, ordered by
         * startTime ASC.
         */
        List<Booking> findByResourceIdAndStatusOrderByStartTime(Long resourceId, BookingStatus status);
}
