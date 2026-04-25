package com.campusops.campus_ops_backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.EnumSet;
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
                .description(dto.getDescription().trim() + "\n\nResource/Location: " + dto.getResourceLocation().trim())
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
    public TicketResponseDTO getById(Long id, User currentUser) {
        Ticket ticket = findTicket(id);
        if (!canAccessTicket(ticket, currentUser)) {
            throw new UnauthorizedActionException("You are not allowed to view this ticket");
        }
        return TicketResponseDTO.from(ticket);
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
        validateStatusTransition(ticket, newStatus, actingUser, resolutionNote);
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
        if (assignee.getRole() != User.Role.TECHNICIAN) {
            throw new IllegalArgumentException("Ticket can only be assigned to a technician");
        }
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
    public CommentResponseDTO updateComment(Long ticketId, Long commentId, CommentRequestDTO dto, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        if (comment.getTicket() == null || !comment.getTicket().getId().equals(ticketId)) {
            throw new ResourceNotFoundException(
                    "Comment not found with id: " + commentId + " for ticket id: " + ticketId);
        }
        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;
        boolean isAuthor = comment.getAuthor() != null && comment.getAuthor().getId().equals(currentUser.getId());
        if (!isAuthor && !isAdmin) {
            throw new UnauthorizedActionException("You are not allowed to edit this comment");
        }
        comment.setBody(dto.getBody());
        comment.setUpdatedAt(java.time.LocalDateTime.now());
        return CommentResponseDTO.from(commentRepository.save(comment));
    }

    @Transactional(readOnly = true)
    public List<CommentResponseDTO> getComments(Long ticketId, User currentUser) {
        Ticket ticket = findTicket(ticketId);
        if (!canAccessTicket(ticket, currentUser)) {
            throw new UnauthorizedActionException("You are not allowed to view comments for this ticket");
        }
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream()
                .map(CommentResponseDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public TicketAttachmentFileDTO getAttachmentFile(Long ticketId, String fileName, User currentUser) {
        Ticket ticket = findTicket(ticketId);
        if (!canAccessTicket(ticket, currentUser)) {
            throw new UnauthorizedActionException("You are not allowed to access attachments for this ticket");
        }

        List<TicketAttachment> attachments = ticketAttachmentRepository.findByTicketId(ticketId);
        TicketAttachment matchingAttachment = attachments.stream()
                .filter(attachment -> {
                    String filePath = attachment.getFilePath();
                    if (filePath == null) {
                        return false;
                    }
                    Path path = Paths.get(filePath);
                    Path name = path.getFileName();
                    return name != null && name.toString().equals(fileName);
                })
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found for ticket id: " + ticketId));

        Path filePath = Paths.get(matchingAttachment.getFilePath());
        if (!Files.exists(filePath)) {
            throw new ResourceNotFoundException("Attachment file missing for ticket id: " + ticketId);
        }
        try {
            return new TicketAttachmentFileDTO(Files.readAllBytes(filePath), matchingAttachment.getMimeType(),
                    matchingAttachment.getOriginalFileName());
        } catch (IOException ex) {
            throw new FileStorageException("Failed to load ticket attachment", ex);
        }
    }

    @Transactional
    public void deleteComment(Long ticketId, Long commentId, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        if (comment.getTicket() == null || !comment.getTicket().getId().equals(ticketId)) {
            throw new ResourceNotFoundException(
                    "Comment not found with id: " + commentId + " for ticket id: " + ticketId);
        }
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
        deleteTicketDirectory(ticket.getId());
        ticketRepository.delete(ticket);
    }

    private void deleteTicketDirectory(Long ticketId) {
        Path ticketDirectory = Paths.get(uploadDir, String.valueOf(ticketId));
        if (!Files.exists(ticketDirectory)) {
            return;
        }
        try (var paths = Files.walk(ticketDirectory)) {
            paths.sorted(Comparator.reverseOrder()).forEach(path -> {
                try {
                    Files.deleteIfExists(path);
                } catch (IOException ex) {
                    throw new FileStorageException("Failed to delete ticket attachments for ticket id: " + ticketId, ex);
                }
            });
        } catch (IOException ex) {
            throw new FileStorageException("Failed to delete ticket attachments for ticket id: " + ticketId, ex);
        }
    }

    private Ticket findTicket(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    private boolean canAccessTicket(Ticket ticket, User currentUser) {
        if (currentUser == null) {
            return false;
        }
        if (currentUser.getRole() == User.Role.ADMIN || currentUser.getRole() == User.Role.TECHNICIAN) {
            return true;
        }
        boolean isReporter = ticket.getReporter() != null && ticket.getReporter().getId().equals(currentUser.getId());
        boolean isAssignee = ticket.getAssignee() != null && ticket.getAssignee().getId().equals(currentUser.getId());
        return isReporter || isAssignee;
    }

    private void validateStatusTransition(Ticket ticket, Ticket.TicketStatus newStatus, User actingUser,
            String resolutionNote) {
        Ticket.TicketStatus currentStatus = ticket.getStatus();
        if (currentStatus == Ticket.TicketStatus.CLOSED || currentStatus == Ticket.TicketStatus.REJECTED) {
            throw new IllegalArgumentException("Closed or rejected tickets cannot be moved to another status");
        }

        boolean isAdmin = actingUser.getRole() == User.Role.ADMIN;
        EnumSet<Ticket.TicketStatus> allowedNext = switch (currentStatus) {
            case OPEN -> EnumSet.of(Ticket.TicketStatus.IN_PROGRESS, Ticket.TicketStatus.REJECTED);
            case IN_PROGRESS -> EnumSet.of(Ticket.TicketStatus.RESOLVED, Ticket.TicketStatus.REJECTED);
            case RESOLVED -> EnumSet.of(Ticket.TicketStatus.CLOSED, Ticket.TicketStatus.REJECTED);
            default -> EnumSet.noneOf(Ticket.TicketStatus.class);
        };

        if (!allowedNext.contains(newStatus)) {
            throw new IllegalArgumentException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }

        if (newStatus == Ticket.TicketStatus.REJECTED) {
            if (!isAdmin) {
                throw new UnauthorizedActionException("Only admins can reject tickets");
            }
            if (resolutionNote == null || resolutionNote.isBlank()) {
                throw new IllegalArgumentException("A rejection reason is required when setting status to REJECTED");
            }
        }
    }

    public record TicketAttachmentFileDTO(byte[] content, String mimeType, String originalFileName) {
    }
}
