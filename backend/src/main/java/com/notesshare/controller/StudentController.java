package com.notesshare.controller;

import com.notesshare.dto.common.ApiResponse;
import com.notesshare.dto.common.DashboardResponse;
import com.notesshare.dto.student.StudentResponse;
import com.notesshare.dto.student.UpdateProfileRequest;
import com.notesshare.service.AdminService;
import com.notesshare.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@Tag(name = "Student Profile", description = "Student account profile and dashboard endpoints")
public class StudentController {

    private final StudentService studentService;
    private final AdminService adminService;

    public StudentController(StudentService studentService, AdminService adminService) {
        this.studentService = studentService;
        this.adminService = adminService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current student profile", description = "Returns profile details of the authenticated student")
    public ResponseEntity<ApiResponse<StudentResponse>> getMyProfile() {
        StudentResponse response = studentService.getCurrentProfile();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current student profile", description = "Updates profile information for the authenticated student")
    public ResponseEntity<ApiResponse<StudentResponse>> updateMyProfile(@Valid @RequestBody UpdateProfileRequest request) {
        StudentResponse response = studentService.updateCurrentProfile(request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get student dashboard statistics", description = "Returns dashboard metrics, upload counts, top-rated and recent notes")
    public ResponseEntity<ApiResponse<DashboardResponse>> getStudentDashboard() {
        DashboardResponse response = adminService.getStudentDashboard();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
