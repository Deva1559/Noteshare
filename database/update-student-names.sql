-- ================================================================
-- NOTESSHARE: Update Student Names to Deva and Ranjan
-- Works cleanly with MySQL Workbench Safe Update Mode enabled
-- ================================================================

USE notesshare_db;

-- Method 1: Direct Primary Key updates (Bypasses Safe Update Mode)
UPDATE students 
SET name = 'Deva', email = 'deva@notesshare.com' 
WHERE id = 2;

UPDATE students 
SET name = 'Ranjan', email = 'ranjan@notesshare.com' 
WHERE id = 3;

-- Verify the updated rows
SELECT id, name, email, department, year, role FROM students;
