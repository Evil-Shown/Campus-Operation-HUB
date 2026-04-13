package com.campusops.campus_ops_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campusops.campus_ops_backend.model.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTicketIdOrderByCreatedAtAsc(Long ticketId);

    boolean existsByIdAndAuthorId(Long commentId, Long authorId);
}