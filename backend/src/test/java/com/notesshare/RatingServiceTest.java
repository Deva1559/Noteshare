package com.notesshare;

import com.notesshare.dto.rating.RatingRequest;
import com.notesshare.dto.rating.RatingResponse;
import com.notesshare.entity.Note;
import com.notesshare.entity.Rating;
import com.notesshare.entity.Role;
import com.notesshare.entity.Student;
import com.notesshare.exception.BadRequestException;
import com.notesshare.exception.DuplicateRatingException;
import com.notesshare.repository.NoteRepository;
import com.notesshare.repository.RatingRepository;
import com.notesshare.repository.StudentRepository;
import com.notesshare.security.CustomUserDetails;
import com.notesshare.service.RatingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private RatingService ratingService;

    private Student mockStudent;
    private Note mockNote;

    @BeforeEach
    void setUp() {
        mockStudent = new Student("Test Student", "student@test.com", "pass123", "CS", 3, Role.STUDENT);
        mockStudent.setId(10L);

        mockNote = new Note();
        mockNote.setId(100L);
        mockNote.setTitle("Operating Systems Notes");
        mockNote.setAverageRating(0.0);

        CustomUserDetails userDetails = new CustomUserDetails(mockStudent);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities())
        );
    }

    @Test
    @DisplayName("Should successfully add a rating when student has not rated yet")
    void testAddRatingSuccess() {
        RatingRequest request = new RatingRequest(5);

        when(noteRepository.findById(100L)).thenReturn(Optional.of(mockNote));
        when(studentRepository.findById(10L)).thenReturn(Optional.of(mockStudent));
        when(ratingRepository.existsByStudentIdAndNoteId(10L, 100L)).thenReturn(false);

        Rating savedRating = new Rating(5, mockStudent, mockNote);
        savedRating.setId(500L);
        when(ratingRepository.save(any(Rating.class))).thenReturn(savedRating);
        when(ratingRepository.calculateAverageRatingByNoteId(100L)).thenReturn(5.0);

        RatingResponse response = ratingService.addRating(100L, request);

        assertNotNull(response);
        assertEquals(5, response.getRatingValue());
        assertEquals(5.0, response.getNewAverageRating());
        verify(noteRepository, times(1)).save(mockNote);
    }

    @Test
    @DisplayName("Should throw DuplicateRatingException when student rates the same note twice")
    void testDuplicateRatingThrowsException() {
        RatingRequest request = new RatingRequest(4);

        when(noteRepository.findById(100L)).thenReturn(Optional.of(mockNote));
        when(studentRepository.findById(10L)).thenReturn(Optional.of(mockStudent));
        when(ratingRepository.existsByStudentIdAndNoteId(10L, 100L)).thenReturn(true);

        assertThrows(DuplicateRatingException.class, () -> ratingService.addRating(100L, request));
        verify(ratingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw BadRequestException when rating is outside 1-5 range")
    void testInvalidRatingRange() {
        RatingRequest zeroRating = new RatingRequest(0);
        RatingRequest sixRating = new RatingRequest(6);

        when(noteRepository.findById(100L)).thenReturn(Optional.of(mockNote));
        when(studentRepository.findById(10L)).thenReturn(Optional.of(mockStudent));

        assertThrows(BadRequestException.class, () -> ratingService.addRating(100L, zeroRating));
        assertThrows(BadRequestException.class, () -> ratingService.addRating(100L, sixRating));
    }
}
