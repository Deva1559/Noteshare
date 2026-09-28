package com.notesshare.dto.common;

import com.notesshare.dto.note.NoteResponse;
import java.util.List;

public class DashboardResponse {

    private long totalNotes;
    private long totalSubjects;
    private long totalDownloads;
    private long myNotesCount;
    private long myDownloadsCount;
    private List<NoteResponse> topRatedNotes;
    private List<NoteResponse> recentNotes;
    private List<NoteResponse> myRecentNotes;

    public DashboardResponse() {
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

    public long getTotalDownloads() {
        return totalDownloads;
    }

    public void setTotalDownloads(long totalDownloads) {
        this.totalDownloads = totalDownloads;
    }

    public long getMyNotesCount() {
        return myNotesCount;
    }

    public void setMyNotesCount(long myNotesCount) {
        this.myNotesCount = myNotesCount;
    }

    public long getMyDownloadsCount() {
        return myDownloadsCount;
    }

    public void setMyDownloadsCount(long myDownloadsCount) {
        this.myDownloadsCount = myDownloadsCount;
    }

    public List<NoteResponse> getTopRatedNotes() {
        return topRatedNotes;
    }

    public void setTopRatedNotes(List<NoteResponse> topRatedNotes) {
        this.topRatedNotes = topRatedNotes;
    }

    public List<NoteResponse> getRecentNotes() {
        return recentNotes;
    }

    public void setRecentNotes(List<NoteResponse> recentNotes) {
        this.recentNotes = recentNotes;
    }

    public List<NoteResponse> getMyRecentNotes() {
        return myRecentNotes;
    }

    public void setMyRecentNotes(List<NoteResponse> myRecentNotes) {
        this.myRecentNotes = myRecentNotes;
    }
}
