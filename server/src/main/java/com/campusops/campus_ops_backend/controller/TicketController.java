package com.campusops.campus_ops_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.validation.annotation.Validated;

import com.campusops.campus_ops_backend.dto.request.CommentRequestDTO;
import com.campusops.campus_ops_backend.dto.request.TicketRequestDTO;
import com.campusops.campus_ops_backend.dto.response.CommentResponseDTO;
import com.campusops.campus_ops_backend.dto.response.TicketResponseDTO;
import com.campusops.campus_ops_backend.model.Ticket;
import com.campusops.campus_ops_backend.security.UserPrincipal;
import com.campusops.campus_ops_backend.service.TicketService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@Validated
public class TicketController {

    private final TicketService ticketService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketResponseDTO> create(@RequestPart("data") @Valid TicketRequestDTO dto,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.create(dto, files, principal.getUser()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
    public ResponseEntity<List<TicketResponseDTO>> all(@RequestParam(required = false) Ticket.TicketStatus status) {
        return ResponseEntity.ok(ticketService.getAll(status));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketResponseDTO>> myTickets(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(ticketService.getMyTickets(principal.getUser().getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getById(@PathVariable @Positive Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(ticketService.getById(id, principal.getUser()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
    public ResponseEntity<TicketResponseDTO> updateStatus(@PathVariable @Positive Long id,
            @RequestParam @NotNull Ticket.TicketStatus status,
            @RequestParam(required = false) @Size(max = 2000) String resolutionNote,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(ticketService.updateStatus(id, status, resolutionNote, principal.getUser()));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponseDTO> assign(@PathVariable @Positive Long id,
            @RequestParam @Positive Long assigneeId,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(ticketService.assign(id, assigneeId, principal.getUser()));
    }

    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<CommentResponseDTO> addComment(@PathVariable @Positive Long ticketId,
            @Valid @RequestBody CommentRequestDTO dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.addComment(ticketId, dto, principal.getUser()));
    }

    @PatchMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<CommentResponseDTO> updateComment(@PathVariable @Positive Long ticketId,
            @PathVariable @Positive Long commentId,
            @Valid @RequestBody CommentRequestDTO dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(ticketService.updateComment(ticketId, commentId, dto, principal.getUser()));
    }

    @GetMapping("/{ticketId}/comments")
    public ResponseEntity<List<CommentResponseDTO>> getComments(@PathVariable @Positive Long ticketId,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(ticketService.getComments(ticketId, principal.getUser()));
    }

    @GetMapping("/{ticketId}/attachments/{fileName}")
    public ResponseEntity<byte[]> getAttachment(@PathVariable @Positive Long ticketId,
            @PathVariable String fileName,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        TicketService.TicketAttachmentFileDTO file = ticketService.getAttachmentFile(ticketId, fileName, principal.getUser());
        String safeFileName = file.originalFileName() == null || file.originalFileName().isBlank()
                ? "attachment"
                : file.originalFileName();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.mimeType() == null ? MediaType.APPLICATION_OCTET_STREAM_VALUE : file.mimeType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + safeFileName + "\"")
                .body(file.content());
    }

    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable @Positive Long ticketId,
            @PathVariable @Positive Long commentId,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ticketService.deleteComment(ticketId, commentId, principal.getUser());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable @Positive Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ticketService.delete(id, principal.getUser());
        return ResponseEntity.noContent().build();
    }
}
