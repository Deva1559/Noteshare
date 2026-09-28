package com.notesshare.controller;

import com.notesshare.dto.common.ApiResponse;
import com.notesshare.dto.subject.SubjectRequest;
import com.notesshare.dto.subject.SubjectResponse;
import com.notesshare.service.SubjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@Tag(name = "Subjects", description = "Endpoints for academic subject catalog")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping
    @Operation(summary = "Get all subjects", description = "Returns all available academic subjects")
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAllSubjects() {
        List<SubjectResponse> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(ApiResponse.success(subjects));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get subject by ID", description = "Returns details of a specific subject")
    public ResponseEntity<ApiResponse<SubjectResponse>> getSubjectById(@PathVariable Long id) {
        SubjectResponse response = subjectService.getSubjectById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new subject (Admin only)", description = "Adds a new academic subject to the catalog")
    public ResponseEntity<ApiResponse<SubjectResponse>> createSubject(@Valid @RequestBody SubjectRequest request) {
        SubjectResponse response = subjectService.createSubject(request);
        return new ResponseEntity<>(ApiResponse.success("Subject created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update subject (Admin only)", description = "Modifies existing subject details")
    public ResponseEntity<ApiResponse<SubjectResponse>> updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody SubjectRequest request) {
        SubjectResponse response = subjectService.updateSubject(id, request);
        return ResponseEntity.ok(ApiResponse.success("Subject updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete subject (Admin only)", description = "Removes a subject from the catalog")
    public ResponseEntity<ApiResponse<Void>> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok(ApiResponse.success("Subject deleted successfully", null));
    }
}
