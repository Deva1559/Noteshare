package com.notesshare.dto.subject;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SubjectRequest {

    @NotBlank(message = "Subject name cannot be empty")
    @Size(min = 2, max = 150, message = "Subject name must be between 2 and 150 characters")
    private String name;

    @NotBlank(message = "Subject code cannot be empty")
    @Size(min = 2, max = 50, message = "Subject code must be between 2 and 50 characters")
    private String code;

    private String description;

    public SubjectRequest() {
    }

    public SubjectRequest(String name, String code, String description) {
        this.name = name;
        this.code = code;
        this.description = description;
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
}
