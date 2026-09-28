package com.notesshare.dto.rating;

import java.time.LocalDateTime;

public class RatingResponse {

    private Long id;
    private Integer ratingValue;
    private Long studentId;
    private String studentName;
    private Long noteId;
    private Double newAverageRating;
    private LocalDateTime createdAt;

    public RatingResponse() {
    }

    public RatingResponse(Long id, Integer ratingValue, Long studentId, String studentName, Long noteId, Double newAverageRating, LocalDateTime createdAt) {
        this.id = id;
        this.ratingValue = ratingValue;
        this.studentId = studentId;
        this.studentName = studentName;
        this.noteId = noteId;
        this.newAverageRating = newAverageRating;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRatingValue() {
        return ratingValue;
    }

    public void setRatingValue(Integer ratingValue) {
        this.ratingValue = ratingValue;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Long getNoteId() {
        return noteId;
    }

    public void setNoteId(Long noteId) {
        this.noteId = noteId;
    }

    public Double getNewAverageRating() {
        return newAverageRating;
    }

    public void setNewAverageRating(Double newAverageRating) {
        this.newAverageRating = newAverageRating;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
