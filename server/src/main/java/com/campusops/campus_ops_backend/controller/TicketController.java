package com.campusops.campus_ops_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
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

import com.campusops.campus_ops_backend.dto.request.CommentRequestDTO;
import com.campusops.campus_ops_backend.dto.request.TicketRequestDTO;
import com.campusops.campus_ops_backend.dto.response.CommentResponseDTO;
import com.campusops.campus_ops_backend.dto.response.TicketResponseDTO;
import com.campusops.campus_ops_backend.model.Ticket;
import com.campusops.campus_ops_backend.security.UserPrincipal;
import com.campusops.campus_ops_backend.service.TicketService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
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
    public ResponseEntity<TicketResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getById(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
    public ResponseEntity<TicketResponseDTO> updateStatus(@PathVariable Long id,
            @RequestParam Ticket.TicketStatus status,
            @RequestParam(required = false) String resolutionNote,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(ticketService.updateStatus(id, status, resolutionNote, principal.getUser()));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponseDTO> assign(@PathVariable Long id,
            @RequestParam Long assigneeId,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(ticketService.assign(id, assigneeId, principal.getUser()));
    }

    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<CommentResponseDTO> addComment(@PathVariable Long ticketId,
            @Valid @RequestBody CommentRequestDTO dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.addComment(ticketId, dto, principal.getUser()));
    }

    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long ticketId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ticketService.deleteComment(commentId, principal.getUser());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ticketService.delete(id, principal.getUser());
        return ResponseEntity.noContent().build();
    }
}
