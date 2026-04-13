package com.campusops.campus_ops_backend.dto.response;

import java.time.LocalDateTime;

import com.campusops.campus_ops_backend.model.Comment;

public record CommentResponseDTO(
        Long id,
        UserSummaryDTO author,
        String body,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static CommentResponseDTO from(Comment c) {
        return new CommentResponseDTO(
                c.getId(),
                c.getAuthor() == null ? null : new UserSummaryDTO(
                        c.getAuthor().getId(),
                        c.getAuthor().getName(),
                        c.getAuthor().getEmail(),
                        c.getAuthor().getPictureUrl(),
                        c.getAuthor().getRole()),
                c.getBody(),
                c.getCreatedAt(),
                c.getUpdatedAt());
    }
}