package com.notesshare.service;

import com.notesshare.dto.auth.AuthResponse;
import com.notesshare.dto.auth.LoginRequest;
import com.notesshare.dto.auth.RegisterRequest;
import com.notesshare.entity.Role;
import com.notesshare.entity.Student;
import com.notesshare.exception.BadRequestException;
import com.notesshare.repository.StudentRepository;
import com.notesshare.security.CustomUserDetails;
import com.notesshare.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (studentRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists.");
        }

        Student student = new Student(
                request.getName().trim(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getDepartment() != null ? request.getDepartment().trim() : null,
                request.getYear(),
                Role.STUDENT
        );

        Student savedStudent = studentRepository.save(student);
        CustomUserDetails userDetails = new CustomUserDetails(savedStudent);
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(
                token,
                savedStudent.getId(),
                savedStudent.getName(),
                savedStudent.getEmail(),
                savedStudent.getRole().name(),
                savedStudent.getDepartment(),
                savedStudent.getYear()
        );
    }

    public AuthResponse login(LoginRequest request) {
        String cleanEmail = request.getEmail().toLowerCase().trim();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(cleanEmail, request.getPassword())
        );

        Student student = studentRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        CustomUserDetails userDetails = new CustomUserDetails(student);
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(
                token,
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getRole().name(),
                student.getDepartment(),
                student.getYear()
        );
    }
}
