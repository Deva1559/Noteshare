package com.notesshare.controller;

import com.notesshare.dto.common.ApiResponse;
import com.notesshare.dto.common.PageResponse;
import com.notesshare.dto.note.CreateNoteRequest;
import com.notesshare.dto.note.NoteResponse;
import com.notesshare.dto.note.UpdateNoteRequest;
import com.notesshare.service.NoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@Tag(name = "Notes", description = "Endpoints for uploading, searching, downloading and managing notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    @Operation(summary = "Get notes with search and filter", description = "Filter by keyword, subject, unit with pagination and sorting")
    public ResponseEntity<ApiResponse<PageResponse<NoteResponse>>> getNotes(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Integer unit,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        Sort.Direction direction = (sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        // Map frontend sort fields safely
        if ("rating".equalsIgnoreCase(sortField)) {
            sortField = "averageRating";
        } else if ("downloads".equalsIgnoreCase(sortField)) {
            sortField = "downloadCount";
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        PageResponse<NoteResponse> response = noteService.getAllNotes(keyword, subjectId, unit, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/search")
    @Operation(summary = "Search notes by keyword", description = "Search in title, description, subject name and code")
    public ResponseEntity<ApiResponse<PageResponse<NoteResponse>>> searchNotes(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<NoteResponse> response = noteService.getAllNotes(keyword, null, null, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/top-rated")
    @Operation(summary = "Get top-rated notes", description = "Returns notes with the highest average rating")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getTopRatedNotes() {
        List<NoteResponse> notes = noteService.getTopRatedNotes();
        return ResponseEntity.ok(ApiResponse.success(notes));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recently uploaded notes", description = "Returns most recently uploaded notes")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getRecentNotes() {
        List<NoteResponse> notes = noteService.getRecentNotes();
        return ResponseEntity.ok(ApiResponse.success(notes));
    }

    @GetMapping("/my-notes")
    @Operation(summary = "Get notes uploaded by current user", description = "Returns notes uploaded by the authenticated student")
    public ResponseEntity<ApiResponse<PageResponse<NoteResponse>>> getMyNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<NoteResponse> response = noteService.getMyNotes(pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get note by ID", description = "Returns details of a specific note")
    public ResponseEntity<ApiResponse<NoteResponse>> getNoteById(@PathVariable Long id) {
        NoteResponse response = noteService.getNoteById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a new note", description = "Uploads document file with academic metadata")
    public ResponseEntity<ApiResponse<NoteResponse>> uploadNote(
            @RequestParam("title") @NotBlank String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("unit") @NotNull @Min(1) Integer unit,
            @RequestParam("subjectId") @NotNull Long subjectId,
            @RequestParam("file") @NotNull MultipartFile file
    ) {
        CreateNoteRequest request = new CreateNoteRequest(title, description, unit, subjectId);
        NoteResponse response = noteService.uploadNote(request, file);
        return new ResponseEntity<>(ApiResponse.success("Note uploaded successfully", response), HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update note", description = "Updates title, description, unit, subject and optionally replaces file")
    public ResponseEntity<ApiResponse<NoteResponse>> updateNote(
            @PathVariable Long id,
            @RequestParam("title") @NotBlank String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("unit") @NotNull @Min(1) Integer unit,
            @RequestParam("subjectId") @NotNull Long subjectId,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        UpdateNoteRequest request = new UpdateNoteRequest(title, description, unit, subjectId);
        NoteResponse response = noteService.updateNote(id, request, file);
        return ResponseEntity.ok(ApiResponse.success("Note updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete note", description = "Deletes note and physical file (uploader or admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok(ApiResponse.success("Note deleted successfully", null));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Download note document", description = "Increments download counter and serves file resource")
    public ResponseEntity<Resource> downloadNote(@PathVariable Long id) {
        NoteService.DownloadResult result = noteService.downloadNote(id);

        String contentDisposition = "attachment; filename=\"" + result.getFileName().replace("\"", "\\\"") + "\"";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(result.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(result.getResource());
    }
}
