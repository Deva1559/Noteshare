package com.notesshare.dto.note;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateNoteRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    private String description;

    @NotNull(message = "Unit is required")
    @Min(value = 1, message = "Unit number must be at least 1")
    private Integer unit;

    @NotNull(message = "Subject is required")
    private Long subjectId;

    public UpdateNoteRequest() {
    }

    public UpdateNoteRequest(String title, String description, Integer unit, Long subjectId) {
        this.title = title;
        this.description = description;
        this.unit = unit;
        this.subjectId = subjectId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getUnit() {
        return unit;
    }

    public void setUnit(Integer unit) {
        this.unit = unit;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }
}
