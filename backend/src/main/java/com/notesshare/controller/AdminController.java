package com.notesshare.controller;

import com.notesshare.dto.common.AdminDashboardResponse;
import com.notesshare.dto.common.ApiResponse;
import com.notesshare.dto.common.PageResponse;
import com.notesshare.dto.student.StudentResponse;
import com.notesshare.service.AdminService;
import com.notesshare.service.NoteService;
import com.notesshare.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Operations", description = "Endpoints restricted to administrative users")
public class AdminController {

    private final AdminService adminService;
    private final StudentService studentService;
    private final NoteService noteService;

    public AdminController(AdminService adminService, StudentService studentService, NoteService noteService) {
        this.adminService = adminService;
        this.studentService = studentService;
        this.noteService = noteService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get administrator dashboard metrics", description = "Provides system-wide metrics on students, notes, ratings and downloads")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboard() {
        AdminDashboardResponse response = adminService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/students")
    @Operation(summary = "Get all registered students", description = "Returns paginated list of all students")
    public ResponseEntity<ApiResponse<PageResponse<StudentResponse>>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<StudentResponse> response = studentService.getAllStudents(pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/notes/{id}")
    @Operation(summary = "Delete note as administrator", description = "Allows administrators to remove inappropriate or infringing notes")
    public ResponseEntity<ApiResponse<Void>> deleteNoteAsAdmin(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok(ApiResponse.success("Note removed successfully by administrator", null));
    }
}
