package com.notesshare;

import com.notesshare.entity.Note;
import com.notesshare.entity.Role;
import com.notesshare.entity.Student;
import com.notesshare.exception.UnauthorizedActionException;
import com.notesshare.mapper.NoteMapper;
import com.notesshare.repository.NoteRepository;
import com.notesshare.repository.StudentRepository;
import com.notesshare.repository.SubjectRepository;
import com.notesshare.security.CustomUserDetails;
import com.notesshare.service.FileStorageService;
import com.notesshare.service.NoteService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NoteServiceTest {

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private NoteMapper noteMapper;

    @InjectMocks
    private NoteService noteService;

    @Test
    @DisplayName("Should throw UnauthorizedActionException when another student attempts to delete a note")
    void testUnauthorizedStudentCannotDeleteNote() {
        Student owner = new Student("Owner", "owner@test.com", "pass", "CS", 3, Role.STUDENT);
        owner.setId(1L);

        Note note = new Note();
        note.setId(50L);
        note.setUploader(owner);
        note.setStoredFileName("stored_uuid_sample.pdf");

        Student anotherStudent = new Student("Attacker", "attacker@test.com", "pass", "IT", 2, Role.STUDENT);
        anotherStudent.setId(2L);

        CustomUserDetails attackerDetails = new CustomUserDetails(anotherStudent);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(attackerDetails, null, attackerDetails.getAuthorities())
        );

        when(noteRepository.findById(50L)).thenReturn(Optional.of(note));

        assertThrows(UnauthorizedActionException.class, () -> noteService.deleteNote(50L));
        verify(noteRepository, never()).delete(any(Note.class));
        verify(fileStorageService, never()).deleteFile(any());
    }

    @Test
    @DisplayName("Should allow owner to delete their own note")
    void testOwnerCanDeleteNote() {
        Student owner = new Student("Owner", "owner@test.com", "pass", "CS", 3, Role.STUDENT);
        owner.setId(1L);

        Note note = new Note();
        note.setId(50L);
        note.setUploader(owner);
        note.setStoredFileName("stored_uuid_sample.pdf");

        CustomUserDetails ownerDetails = new CustomUserDetails(owner);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(ownerDetails, null, ownerDetails.getAuthorities())
        );

        when(noteRepository.findById(50L)).thenReturn(Optional.of(note));

        assertDoesNotThrow(() -> noteService.deleteNote(50L));
        verify(fileStorageService, times(1)).deleteFile("stored_uuid_sample.pdf");
        verify(noteRepository, times(1)).delete(note);
    }

    @Test
    @DisplayName("Should allow Admin to delete any note")
    void testAdminCanDeleteAnyNote() {
        Student owner = new Student("Owner", "owner@test.com", "pass", "CS", 3, Role.STUDENT);
        owner.setId(1L);

        Note note = new Note();
        note.setId(50L);
        note.setUploader(owner);
        note.setStoredFileName("stored_uuid_sample.pdf");

        Student admin = new Student("Admin User", "admin@test.com", "pass", "Admin", 4, Role.ADMIN);
        admin.setId(99L);

        CustomUserDetails adminDetails = new CustomUserDetails(admin);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(adminDetails, null, adminDetails.getAuthorities())
        );

        when(noteRepository.findById(50L)).thenReturn(Optional.of(note));

        assertDoesNotThrow(() -> noteService.deleteNote(50L));
        verify(fileStorageService, times(1)).deleteFile("stored_uuid_sample.pdf");
        verify(noteRepository, times(1)).delete(note);
    }
}
