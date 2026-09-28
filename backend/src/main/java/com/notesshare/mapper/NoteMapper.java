package com.notesshare.mapper;

import com.notesshare.dto.note.NoteResponse;
import com.notesshare.entity.Note;
import com.notesshare.repository.RatingRepository;
import com.notesshare.util.SecurityUtil;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class NoteMapper {

    private final RatingRepository ratingRepository;

    public NoteMapper(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    public NoteResponse toResponse(Note note) {
        if (note == null) {
            return null;
        }

        NoteResponse response = new NoteResponse();
        response.setId(note.getId());
        response.setTitle(note.getTitle());
        response.setDescription(note.getDescription());
        response.setUnit(note.getUnit());
        response.setFileName(note.getFileName());
        response.setFileType(note.getFileType());
        response.setFileSize(note.getFileSize());
        response.setDownloadCount(note.getDownloadCount() != null ? note.getDownloadCount() : 0);

        double rawAvg = note.getAverageRating() != null ? note.getAverageRating() : 0.0;
        double roundedAvg = BigDecimal.valueOf(rawAvg).setScale(1, RoundingMode.HALF_UP).doubleValue();
        response.setAverageRating(roundedAvg);

        long ratingsCount = ratingRepository.countByNoteId(note.getId());
        response.setTotalRatings(ratingsCount);

        if (note.getSubject() != null) {
            response.setSubjectId(note.getSubject().getId());
            response.setSubjectName(note.getSubject().getName());
            response.setSubjectCode(note.getSubject().getCode());
        }

        if (note.getUploader() != null) {
            response.setUploaderId(note.getUploader().getId());
            response.setUploaderName(note.getUploader().getName());
            response.setUploaderEmail(note.getUploader().getEmail());
        }

        // Set ownership & current user rating if authenticated
        SecurityUtil.getCurrentUserId().ifPresent(currentUserId -> {
            if (note.getUploader() != null) {
                response.setOwner(note.getUploader().getId().equals(currentUserId));
            }
            ratingRepository.findByStudentIdAndNoteId(currentUserId, note.getId())
                    .ifPresent(r -> response.setUserRating(r.getRatingValue()));
        });

        response.setCreatedAt(note.getCreatedAt());
        response.setUpdatedAt(note.getUpdatedAt());

        return response;
    }
}
