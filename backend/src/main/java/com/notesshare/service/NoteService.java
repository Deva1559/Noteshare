package com.notesshare.service;

import com.notesshare.dto.common.PageResponse;
import com.notesshare.dto.note.CreateNoteRequest;
import com.notesshare.dto.note.NoteResponse;
import com.notesshare.dto.note.UpdateNoteRequest;
import com.notesshare.entity.Note;
import com.notesshare.entity.Role;
import com.notesshare.entity.Student;
import com.notesshare.entity.Subject;
import com.notesshare.exception.ResourceNotFoundException;
import com.notesshare.exception.UnauthorizedActionException;
import com.notesshare.mapper.NoteMapper;
import com.notesshare.repository.NoteRepository;
import com.notesshare.repository.StudentRepository;
import com.notesshare.repository.SubjectRepository;
import com.notesshare.security.CustomUserDetails;
import com.notesshare.util.SecurityUtil;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final FileStorageService fileStorageService;
    private final NoteMapper noteMapper;

    public NoteService(
            NoteRepository noteRepository,
            SubjectRepository subjectRepository,
            StudentRepository studentRepository,
            FileStorageService fileStorageService,
            NoteMapper noteMapper
    ) {
        this.noteRepository = noteRepository;
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
        this.fileStorageService = fileStorageService;
        this.noteMapper = noteMapper;
    }

    @Transactional(readOnly = true)
    public PageResponse<NoteResponse> getAllNotes(
            String keyword,
            Long subjectId,
            Integer unit,
            Pageable pageable
    ) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        Page<Note> page = noteRepository.findFilteredNotes(cleanKeyword, subjectId, unit, pageable);
        List<NoteResponse> content = page.getContent().stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
        return PageResponse.of(page, content);
    }

    @Transactional(readOnly = true)
    public NoteResponse getNoteById(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", id));
        return noteMapper.toResponse(note);
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getTopRatedNotes() {
        return noteRepository.findTop6ByOrderByAverageRatingDescCreatedAtDesc().stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getRecentNotes() {
        return noteRepository.findTop6ByOrderByCreatedAtDesc().stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<NoteResponse> getMyNotes(Pageable pageable) {
        Long currentUserId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedActionException("Authentication is required to view your uploaded notes"));

        Page<Note> page = noteRepository.findByUploaderId(currentUserId, pageable);
        List<NoteResponse> content = page.getContent().stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
        return PageResponse.of(page, content);
    }

    @Transactional
    public NoteResponse uploadNote(CreateNoteRequest request, MultipartFile file) {
        // Authenticated student check
        Long currentUserId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedActionException("Only authenticated students can upload notes"));

        Student uploader = studentRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", currentUserId));

        // Subject check
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", request.getSubjectId()));

        // Store file locally
        FileStorageService.StoredFileInfo fileInfo = fileStorageService.storeFile(file);

        Note note = new Note();
        note.setTitle(request.getTitle().trim());
        note.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        note.setUnit(request.getUnit());
        note.setFileName(fileInfo.getOriginalFileName());
        note.setStoredFileName(fileInfo.getStoredFileName());
        note.setFilePath(fileInfo.getFilePath());
        note.setFileType(fileInfo.getFileType());
        note.setFileSize(fileInfo.getFileSize());
        note.setDownloadCount(0);
        note.setAverageRating(0.0);
        note.setUploader(uploader);
        note.setSubject(subject);

        Note savedNote = noteRepository.save(note);
        return noteMapper.toResponse(savedNote);
    }

    @Transactional
    public NoteResponse updateNote(Long id, UpdateNoteRequest request, MultipartFile newFile) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", id));

        // Authorization check: Only original uploader or ADMIN can update
        verifyOwnershipOrAdmin(note);

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", request.getSubjectId()));

        note.setTitle(request.getTitle().trim());
        note.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        note.setUnit(request.getUnit());
        note.setSubject(subject);

        // If a new replacement file is supplied
        if (newFile != null && !newFile.isEmpty()) {
            // Delete old file
            fileStorageService.deleteFile(note.getStoredFileName());

            // Store new file
            FileStorageService.StoredFileInfo fileInfo = fileStorageService.storeFile(newFile);
            note.setFileName(fileInfo.getOriginalFileName());
            note.setStoredFileName(fileInfo.getStoredFileName());
            note.setFilePath(fileInfo.getFilePath());
            note.setFileType(fileInfo.getFileType());
            note.setFileSize(fileInfo.getFileSize());
        }

        Note updatedNote = noteRepository.save(note);
        return noteMapper.toResponse(updatedNote);
    }

    @Transactional
    public void deleteNote(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", id));

        // Authorization check: Only original uploader or ADMIN can delete
        verifyOwnershipOrAdmin(note);

        // Delete local physical file
        fileStorageService.deleteFile(note.getStoredFileName());

        // Delete from database
        noteRepository.delete(note);
    }

    @Transactional
    public DownloadResult downloadNote(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", id));

        Resource resource = fileStorageService.loadFileAsResource(note.getStoredFileName());

        // Increment download counter
        int currentCount = note.getDownloadCount() != null ? note.getDownloadCount() : 0;
        note.setDownloadCount(currentCount + 1);
        noteRepository.save(note);

        return new DownloadResult(resource, note.getFileName(), note.getFileType());
    }

    private void verifyOwnershipOrAdmin(Note note) {
        CustomUserDetails currentUser = SecurityUtil.getCurrentUserDetails()
                .orElseThrow(() -> new UnauthorizedActionException("You must be logged in to perform this action"));

        boolean isOwner = note.getUploader().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedActionException("You are not authorized to modify or delete this note");
        }
    }

    public static class DownloadResult {
        private final Resource resource;
        private final String fileName;
        private final String contentType;

        public DownloadResult(Resource resource, String fileName, String contentType) {
            this.resource = resource;
            this.fileName = fileName;
            this.contentType = contentType;
        }

        public Resource getResource() {
            return resource;
        }

        public String getFileName() {
            return fileName;
        }

        public String getContentType() {
            return contentType;
        }
    }
}
