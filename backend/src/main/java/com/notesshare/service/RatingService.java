package com.notesshare.service;

import com.notesshare.dto.rating.RatingRequest;
import com.notesshare.dto.rating.RatingResponse;
import com.notesshare.entity.Note;
import com.notesshare.entity.Rating;
import com.notesshare.entity.Student;
import com.notesshare.exception.BadRequestException;
import com.notesshare.exception.DuplicateRatingException;
import com.notesshare.exception.ResourceNotFoundException;
import com.notesshare.exception.UnauthorizedActionException;
import com.notesshare.repository.NoteRepository;
import com.notesshare.repository.RatingRepository;
import com.notesshare.repository.StudentRepository;
import com.notesshare.util.SecurityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final NoteRepository noteRepository;
    private final StudentRepository studentRepository;

    public RatingService(
            RatingRepository ratingRepository,
            NoteRepository noteRepository,
            StudentRepository studentRepository
    ) {
        this.ratingRepository = ratingRepository;
        this.noteRepository = noteRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional
    public RatingResponse addRating(Long noteId, RatingRequest request) {
        // Step 1: Validate note exists
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", noteId));

        // Step 2: Validate authenticated student exists
        Long currentUserId = SecurityUtil.getCurrentUserId()
                .orElseThrow(() -> new UnauthorizedActionException("Only authenticated students can rate notes"));

        Student student = studentRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", currentUserId));

        // Step 3: Check rating range (1-5)
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5 stars");
        }

        // Step 4: Check if student already rated the note
        if (ratingRepository.existsByStudentIdAndNoteId(currentUserId, noteId)) {
            throw new DuplicateRatingException("You have already rated this note.");
        }

        // Step 5: Save rating
        Rating rating = new Rating(request.getRating(), student, note);
        Rating savedRating = ratingRepository.save(rating);

        // Step 6: Recalculate average rating
        Double calculatedAvg = ratingRepository.calculateAverageRatingByNoteId(noteId);
        double roundedAvg = 0.0;
        if (calculatedAvg != null) {
            roundedAvg = BigDecimal.valueOf(calculatedAvg).setScale(1, RoundingMode.HALF_UP).doubleValue();
        }

        // Step 7: Update note average rating
        note.setAverageRating(roundedAvg);
        noteRepository.save(note);

        // Step 8: Return updated response
        return new RatingResponse(
                savedRating.getId(),
                savedRating.getRatingValue(),
                student.getId(),
                student.getName(),
                note.getId(),
                roundedAvg,
                savedRating.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByNoteId(Long noteId) {
        if (!noteRepository.existsById(noteId)) {
            throw new ResourceNotFoundException("Note", "id", noteId);
        }

        return ratingRepository.findByNoteIdOrderByCreatedAtDesc(noteId).stream()
                .map(r -> new RatingResponse(
                        r.getId(),
                        r.getRatingValue(),
                        r.getStudent().getId(),
                        r.getStudent().getName(),
                        r.getNote().getId(),
                        null,
                        r.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
