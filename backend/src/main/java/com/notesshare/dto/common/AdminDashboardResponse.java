package com.notesshare.dto.common;

import com.notesshare.dto.note.NoteResponse;
import java.util.List;

public class AdminDashboardResponse {

    private long totalStudents;
    private long totalNotes;
    private long totalSubjects;
    private long totalRatings;
    private long totalDownloads;
    private List<NoteResponse> recentNotes;
    private List<NoteResponse> topRatedNotes;

    public AdminDashboardResponse() {
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalNotes() {
        return totalNotes;
    }

    public void setTotalNotes(long totalNotes) {
        this.totalNotes = totalNotes;
    }

    public long getTotalSubjects() {
        return totalSubjects;
    }

    public void setTotalSubjects(long totalSubjects) {
        this.totalSubjects = totalSubjects;
    }

    public long getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(long totalRatings) {
        this.totalRatings = totalRatings;
    }

    public long getTotalDownloads() {
        return totalDownloads;
    }

    public void setTotalDownloads(long totalDownloads) {
        this.totalDownloads = totalDownloads;
    }

    public List<NoteResponse> getRecentNotes() {
        return recentNotes;
    }

    public void setRecentNotes(List<NoteResponse> recentNotes) {
        this.recentNotes = recentNotes;
    }

    public List<NoteResponse> getTopRatedNotes() {
        return topRatedNotes;
    }

    public void setTopRatedNotes(List<NoteResponse> topRatedNotes) {
        this.topRatedNotes = topRatedNotes;
    }
}
