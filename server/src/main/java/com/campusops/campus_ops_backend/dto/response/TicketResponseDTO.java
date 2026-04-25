package com.campusops.campus_ops_backend.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.nio.file.Paths;

import com.campusops.campus_ops_backend.model.Ticket;

public record TicketResponseDTO(
        Long id,
        UserSummaryDTO reporter,
        ResourceResponseDTO resource,
        UserSummaryDTO assignee,
        Ticket.TicketCategory category,
        String description,
        Ticket.TicketPriority priority,
        Ticket.TicketStatus status,
        String contactInfo,
        String resolutionNote,
        List<String> attachmentPaths,
        LocalDateTime createdAt) {

    public static TicketResponseDTO from(Ticket t) {
        return new TicketResponseDTO(
                t.getId(),
                t.getReporter() == null ? null : new UserSummaryDTO(
                        t.getReporter().getId(),
                        t.getReporter().getName(),
                        t.getReporter().getEmail(),
                        t.getReporter().getPictureUrl(),
                        t.getReporter().getRole()),
                t.getResource() == null ? null : ResourceResponseDTO.from(t.getResource()),
                t.getAssignee() == null ? null : new UserSummaryDTO(
                        t.getAssignee().getId(),
                        t.getAssignee().getName(),
                        t.getAssignee().getEmail(),
                        t.getAssignee().getPictureUrl(),
                        t.getAssignee().getRole()),
                t.getCategory(),
                t.getDescription(),
                t.getPriority(),
                t.getStatus(),
                t.getContactInfo(),
                t.getResolutionNote(),
                t.getAttachments() == null ? List.of()
                        : t.getAttachments().stream()
                                .map(attachment -> attachment.getFilePath())
                                .map(path -> path == null ? null : Paths.get(path).getFileName().toString())
                                .toList(),
                t.getCreatedAt());
    }
}