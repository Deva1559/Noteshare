-- ================================================================
-- NOTESSHARE: Verification & Data Inspection Queries
-- Database: notesshare_db
-- ================================================================

USE notesshare_db;

-- ----------------------------------------------------------------
-- 1. Check Table Structure & Existing Tables
-- ----------------------------------------------------------------
SHOW TABLES;

-- ----------------------------------------------------------------
-- 2. Count Total Records in Each Table
-- ----------------------------------------------------------------
SELECT 'students' AS table_name, COUNT(*) AS total_count FROM students
UNION ALL
SELECT 'subjects', COUNT(*) FROM subjects
UNION ALL
SELECT 'notes', COUNT(*) FROM notes
UNION ALL
SELECT 'ratings', COUNT(*) FROM ratings;

-- ----------------------------------------------------------------
-- 3. View All Students
-- ----------------------------------------------------------------
SELECT 
    id,
    name,
    email,
    department,
    year,
    role,
    created_at
FROM students
ORDER BY id ASC;

-- ----------------------------------------------------------------
-- 4. View All Subjects
-- ----------------------------------------------------------------
SELECT 
    id,
    code,
    name,
    description,
    created_at
FROM subjects
ORDER BY code ASC;

-- ----------------------------------------------------------------
-- 5. View All Notes with Uploader & Subject Details (Joined)
-- ----------------------------------------------------------------
SELECT 
    n.id AS note_id,
    n.title,
    s.code AS subject_code,
    s.name AS subject_name,
    n.unit,
    st.name AS uploader_name,
    st.email AS uploader_email,
    n.file_name,
    n.file_type,
    ROUND(n.file_size / (1024 * 1024), 2) AS size_mb,
    n.download_count,
    n.average_rating,
    n.created_at
FROM notes n
JOIN subjects s ON n.subject_id = s.id
JOIN students st ON n.uploader_id = st.id
ORDER BY n.created_at DESC;

-- ----------------------------------------------------------------
-- 6. View All Submitted Ratings (Joined)
-- ----------------------------------------------------------------
SELECT 
    r.id AS rating_id,
    st.name AS student_name,
    st.email AS student_email,
    n.title AS note_title,
    r.rating_value AS stars,
    r.created_at AS rated_on
FROM ratings r
JOIN students st ON r.student_id = st.id
JOIN notes n ON r.note_id = n.id
ORDER BY r.created_at DESC;

-- ----------------------------------------------------------------
-- 7. View Note Download Statistics
-- ----------------------------------------------------------------
SELECT 
    id AS note_id,
    title,
    download_count,
    average_rating
FROM notes
ORDER BY download_count DESC;

-- ----------------------------------------------------------------
-- 8. View Average Rating Calculation Validation
-- ----------------------------------------------------------------
SELECT 
    n.id AS note_id,
    n.title,
    n.average_rating AS stored_avg_rating,
    ROUND(AVG(r.rating_value), 1) AS calculated_avg_rating,
    COUNT(r.id) AS total_reviews
FROM notes n
LEFT JOIN ratings r ON n.id = r.note_id
GROUP BY n.id, n.title, n.average_rating;

-- ----------------------------------------------------------------
-- 9. Check Unique Constraints & Indexes
-- ----------------------------------------------------------------
SHOW INDEX FROM ratings;
