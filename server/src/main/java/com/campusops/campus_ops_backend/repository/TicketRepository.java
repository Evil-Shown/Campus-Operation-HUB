package com.campusops.campus_ops_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campusops.campus_ops_backend.model.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByReporterId(Long userId);
    List<Ticket> findByAssigneeId(Long userId);
    List<Ticket> findByStatus(Ticket.TicketStatus status);
}