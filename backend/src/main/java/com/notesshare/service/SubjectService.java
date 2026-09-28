package com.notesshare.service;

import com.notesshare.dto.subject.SubjectRequest;
import com.notesshare.dto.subject.SubjectResponse;
import com.notesshare.entity.Subject;
import com.notesshare.exception.BadRequestException;
import com.notesshare.exception.ResourceNotFoundException;
import com.notesshare.repository.SubjectRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Transactional(readOnly = true)
    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SubjectResponse getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", id));
        return mapToResponse(subject);
    }

    @Transactional
    public SubjectResponse createSubject(SubjectRequest request) {
        String cleanCode = request.getCode().trim().toUpperCase();
        if (subjectRepository.existsByCode(cleanCode)) {
            throw new BadRequestException("Subject code already exists: " + cleanCode);
        }

        Subject subject = new Subject(
                request.getName().trim(),
                cleanCode,
                request.getDescription() != null ? request.getDescription().trim() : null
        );

        Subject saved = subjectRepository.save(subject);
        return mapToResponse(saved);
    }

    @Transactional
    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", id));

        String cleanCode = request.getCode().trim().toUpperCase();
        if (subjectRepository.existsByCodeAndIdNot(cleanCode, id)) {
            throw new BadRequestException("Another subject already uses the code: " + cleanCode);
        }

        subject.setName(request.getName().trim());
        subject.setCode(cleanCode);
        subject.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

        Subject updated = subjectRepository.save(subject);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", id));
        subjectRepository.delete(subject);
    }

    public SubjectResponse mapToResponse(Subject subject) {
        long noteCount = subject.getNotes() != null ? subject.getNotes().size() : 0;
        return new SubjectResponse(
                subject.getId(),
                subject.getName(),
                subject.getCode(),
                subject.getDescription(),
                noteCount,
                subject.getCreatedAt()
        );
    }
}
