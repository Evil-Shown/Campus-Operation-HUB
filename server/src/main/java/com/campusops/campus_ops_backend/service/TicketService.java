package com.campusops.campus_ops_backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.campusops.campus_ops_backend.dto.request.CommentRequestDTO;
import com.campusops.campus_ops_backend.dto.request.TicketRequestDTO;
import com.campusops.campus_ops_backend.dto.response.CommentResponseDTO;
import com.campusops.campus_ops_backend.dto.response.TicketResponseDTO;
import com.campusops.campus_ops_backend.exception.FileStorageException;
import com.campusops.campus_ops_backend.exception.ResourceNotFoundException;
import com.campusops.campus_ops_backend.exception.UnauthorizedActionException;
import com.campusops.campus_ops_backend.model.Comment;
import com.campusops.campus_ops_backend.model.Resource;
import com.campusops.campus_ops_backend.model.Ticket;
import com.campusops.campus_ops_backend.model.TicketAttachment;
import com.campusops.campus_ops_backend.model.User;
import com.campusops.campus_ops_backend.repository.CommentRepository;
import com.campusops.campus_ops_backend.repository.ResourceRepository;
import com.campusops.campus_ops_backend.repository.TicketAttachmentRepository;
import com.campusops.campus_ops_backend.repository.TicketRepository;
import com.campusops.campus_ops_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final TicketAttachmentRepository ticketAttachmentRepository;
    private final CommentRepository commentRepository;
    private final NotificationService notificationService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Transactional
    public TicketResponseDTO create(TicketRequestDTO dto, List<MultipartFile> files, User reporter) {
        if (files != null && files.size() > 3) {
            throw new IllegalArgumentException("A maximum of 3 files can be uploaded");
        }

        Resource resource = dto.getResourceId() == null ? null : resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + dto.getResourceId()));

        Ticket ticket = Ticket.builder()
                .reporter(reporter)
                .resource(resource)
                .category(dto.getCategory())
                .description(dto.getDescription())
                .priority(dto.getPriority())
                .contactInfo(dto.getContactInfo())
                .build();

        Ticket saved = ticketRepository.save(ticket);

        if (files != null) {
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    saveAttachment(file, saved);
                }
            }
        }

        return TicketResponseDTO.from(saved);
    }

    private void saveAttachment(MultipartFile file, Ticket ticket) {
        try {
            if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                throw new IllegalArgumentException("Only image uploads are allowed");
            }

            Path ticketDirectory = Paths.get(uploadDir, String.valueOf(ticket.getId()));
            Files.createDirectories(ticketDirectory);

            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
            String storedFileName = UUID.randomUUID() + "_" + originalFileName;
            Path targetPath = ticketDirectory.resolve(storedFileName);

            file.transferTo(targetPath);

            TicketAttachment attachment = TicketAttachment.builder()
                    .ticket(ticket)
                    .filePath(targetPath.toString())
                    .mimeType(file.getContentType())
                    .originalFileName(originalFileName)
                    .build();
            ticketAttachmentRepository.save(attachment);
            ticket.getAttachments().add(attachment);
        } catch (IOException ex) {
            throw new FileStorageException("Failed to store ticket attachment", ex);
        }
    }

    @Transactional(readOnly = true)
    public TicketResponseDTO getById(Long id) {
        return TicketResponseDTO.from(findTicket(id));
    }

    @Transactional(readOnly = true)
    public List<TicketResponseDTO> getAll(Ticket.TicketStatus status) {
        return (status == null ? ticketRepository.findAll() : ticketRepository.findByStatus(status)).stream()
                .map(TicketResponseDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TicketResponseDTO> getMyTickets(Long userId) {
        return ticketRepository.findByReporterId(userId).stream().map(TicketResponseDTO::from).toList();
    }

    @Transactional
    public TicketResponseDTO updateStatus(Long ticketId, Ticket.TicketStatus newStatus, String resolutionNote, User actingUser) {
        Ticket ticket = findTicket(ticketId);
        ticket.setStatus(newStatus);
        if (resolutionNote != null && !resolutionNote.isBlank()) {
            ticket.setResolutionNote(resolutionNote);
        }
        Ticket saved = ticketRepository.save(ticket);
        notificationService.create(saved.getReporter(), "TICKET_STATUS_CHANGED",
                "Your ticket #" + saved.getId() + " status changed to: " + newStatus);
        return TicketResponseDTO.from(saved);
    }

    @Transactional
    public TicketResponseDTO assign(Long ticketId, Long assigneeId, User admin) {
        Ticket ticket = findTicket(ticketId);
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + assigneeId));
        ticket.setAssignee(assignee);
        if (ticket.getStatus() == Ticket.TicketStatus.OPEN) {
            ticket.setStatus(Ticket.TicketStatus.IN_PROGRESS);
        }
        return TicketResponseDTO.from(ticketRepository.save(ticket));
    }

    @Transactional
    public CommentResponseDTO addComment(Long ticketId, CommentRequestDTO dto, User author) {
        Ticket ticket = findTicket(ticketId);
        Comment comment = Comment.builder()
                .ticket(ticket)
                .author(author)
                .body(dto.getBody())
                .build();
        Comment saved = commentRepository.save(comment);

        if (ticket.getReporter() != null && !ticket.getReporter().getId().equals(author.getId())) {
            notificationService.create(ticket.getReporter(), "TICKET_COMMENT_ADDED",
                    "New comment on your ticket #" + ticketId + " from " + author.getName());
        }

        return CommentResponseDTO.from(saved);
    }

    @Transactional
    public void deleteComment(Long commentId, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;
        boolean isAuthor = comment.getAuthor() != null && comment.getAuthor().getId().equals(currentUser.getId());
        if (!isAuthor && !isAdmin) {
            throw new UnauthorizedActionException("You are not allowed to delete this comment");
        }
        commentRepository.delete(comment);
    }

    @Transactional
    public void delete(Long ticketId, User admin) {
        Ticket ticket = findTicket(ticketId);
        ticketRepository.delete(ticket);
    }

    private Ticket findTicket(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }
}
