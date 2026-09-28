package com.notesshare.repository;

import com.notesshare.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByStudentIdAndNoteId(Long studentId, Long noteId);

    boolean existsByStudentIdAndNoteId(Long studentId, Long noteId);

    List<Rating> findByNoteIdOrderByCreatedAtDesc(Long noteId);

    @Query("SELECT AVG(r.ratingValue) FROM Rating r WHERE r.note.id = :noteId")
    Double calculateAverageRatingByNoteId(@Param("noteId") Long noteId);

    long countByNoteId(Long noteId);
}
