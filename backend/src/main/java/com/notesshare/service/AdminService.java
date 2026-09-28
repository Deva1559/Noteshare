package com.notesshare.service;

import com.notesshare.dto.common.AdminDashboardResponse;
import com.notesshare.dto.common.DashboardResponse;
import com.notesshare.entity.Role;
import com.notesshare.mapper.NoteMapper;
import com.notesshare.repository.NoteRepository;
import com.notesshare.repository.RatingRepository;
import com.notesshare.repository.StudentRepository;
import com.notesshare.repository.SubjectRepository;
import com.notesshare.util.SecurityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final StudentRepository studentRepository;
    private final NoteRepository noteRepository;
    private final SubjectRepository subjectRepository;
    private final RatingRepository ratingRepository;
    private final NoteMapper noteMapper;

    public AdminService(
            StudentRepository studentRepository,
            NoteRepository noteRepository,
            SubjectRepository subjectRepository,
            RatingRepository ratingRepository,
            NoteMapper noteMapper
    ) {
        this.studentRepository = studentRepository;
        this.noteRepository = noteRepository;
        this.subjectRepository = subjectRepository;
        this.ratingRepository = ratingRepository;
        this.noteMapper = noteMapper;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        AdminDashboardResponse response = new AdminDashboardResponse();
        response.setTotalStudents(studentRepository.count());
        response.setTotalNotes(noteRepository.count());
        response.setTotalSubjects(subjectRepository.count());
        response.setTotalRatings(ratingRepository.count());
        response.setTotalDownloads(noteRepository.sumTotalDownloads());
        response.setRecentNotes(noteRepository.findTop6ByOrderByCreatedAtDesc().stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList()));
        response.setTopRatedNotes(noteRepository.findTop6ByOrderByAverageRatingDescCreatedAtDesc().stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList()));
        return response;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getStudentDashboard() {
        DashboardResponse response = new DashboardResponse();
        response.setTotalNotes(noteRepository.count());
        response.setTotalSubjects(subjectRepository.count());
        response.setTotalDownloads(noteRepository.sumTotalDownloads());

        Long currentUserId = SecurityUtil.getCurrentUserId().orElse(null);
        if (currentUserId != null) {
            response.setMyNotesCount(noteRepository.countByUploaderId(currentUserId));
            response.setMyDownloadsCount(noteRepository.sumDownloadsByUploaderId(currentUserId));
            response.setMyRecentNotes(noteRepository.findTop5ByUploaderIdOrderByCreatedAtDesc(currentUserId).stream()
                    .map(noteMapper::toResponse)
                    .collect(Collectors.toList()));
        } else {
            response.setMyNotesCount(0);
            response.setMyDownloadsCount(0);
            response.setMyRecentNotes(Collections.emptyList());
        }

        response.setTopRatedNotes(noteRepository.findTop6ByOrderByAverageRatingDescCreatedAtDesc().stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList()));
        response.setRecentNotes(noteRepository.findTop6ByOrderByCreatedAtDesc().stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList()));

        return response;
    }
}
