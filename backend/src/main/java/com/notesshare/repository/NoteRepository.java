package com.notesshare.repository;

import com.notesshare.entity.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long>, JpaSpecificationExecutor<Note> {

    Page<Note> findByUploaderId(Long uploaderId, Pageable pageable);

    Page<Note> findBySubjectId(Long subjectId, Pageable pageable);

    @Query("SELECT n FROM Note n WHERE " +
           "(:keyword IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(n.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(n.subject.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(n.subject.code) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:subjectId IS NULL OR n.subject.id = :subjectId) AND " +
           "(:unit IS NULL OR n.unit = :unit)")
    Page<Note> findFilteredNotes(
            @Param("keyword") String keyword,
            @Param("subjectId") Long subjectId,
            @Param("unit") Integer unit,
            Pageable pageable
    );

    List<Note> findTop6ByOrderByAverageRatingDescCreatedAtDesc();

    List<Note> findTop6ByOrderByCreatedAtDesc();

    List<Note> findTop5ByUploaderIdOrderByCreatedAtDesc(Long uploaderId);

    long countByUploaderId(Long uploaderId);

    @Query("SELECT COALESCE(SUM(n.downloadCount), 0) FROM Note n")
    Long sumTotalDownloads();

    @Query("SELECT COALESCE(SUM(n.downloadCount), 0) FROM Note n WHERE n.uploader.id = :uploaderId")
    Long sumDownloadsByUploaderId(@Param("uploaderId") Long uploaderId);
}
