package com.notesshare.dto.subject;

import java.time.LocalDateTime;

public class SubjectResponse {

    private Long id;
    private String name;
    private String code;
    private String description;
    private long noteCount;
    private LocalDateTime createdAt;

    public SubjectResponse() {
    }

    public SubjectResponse(Long id, String name, String code, String description, long noteCount, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.noteCount = noteCount;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public long getNoteCount() {
        return noteCount;
    }

    public void setNoteCount(long noteCount) {
        this.noteCount = noteCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
