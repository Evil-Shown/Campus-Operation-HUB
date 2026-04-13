package com.campusops.campus_ops_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campusops.campus_ops_backend.model.TicketAttachment;

public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {

    List<TicketAttachment> findByTicketId(Long ticketId);

    void deleteByTicketId(Long ticketId);
}