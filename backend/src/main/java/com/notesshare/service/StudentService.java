package com.notesshare.service;

import com.notesshare.dto.common.PageResponse;
import com.notesshare.dto.student.StudentResponse;
import com.notesshare.dto.student.UpdateProfileRequest;
import com.notesshare.entity.Student;
import com.notesshare.exception.ResourceNotFoundException;
import com.notesshare.exception.UnauthorizedActionException;
import com.notesshare.repository.StudentRepository;
import com.notesshare.util.SecurityUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Transactional(readOnly = true)
    public StudentResponse getCurrentProfile() {
        Long currentUserId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedActionException("User is not authenticated"));

        Student student = studentRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", currentUserId));

        return mapToResponse(student);
    }

    @Transactional
    public StudentResponse updateCurrentProfile(UpdateProfileRequest request) {
        Long currentUserId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedActionException("User is not authenticated"));

        Student student = studentRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", currentUserId));

        student.setName(request.getName().trim());
        student.setDepartment(request.getDepartment() != null ? request.getDepartment().trim() : null);
        student.setYear(request.getYear());

        Student updated = studentRepository.save(student);
        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public PageResponse<StudentResponse> getAllStudents(Pageable pageable) {
        Page<Student> page = studentRepository.findAll(pageable);
        List<StudentResponse> content = page.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return PageResponse.of(page, content);
    }

    public StudentResponse mapToResponse(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getDepartment(),
                student.getYear(),
                student.getRole().name(),
                student.getCreatedAt()
        );
    }
}
