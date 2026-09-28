-- ================================================================
-- NOTESSHARE: Sample Data for Initial Testing
-- Passwords for all sample users are: Password@123
-- BCrypt Hash: $2a$10$7Z8bU7E/Qv57kF9a2hR.e.P1/sBq1J7vYjX.q2m6k.U/yX3Y6aW5q
-- ================================================================

USE notesshare_db;

-- 1. Insert Initial Subjects
INSERT INTO subjects (id, name, code, description) VALUES
(1, 'Database Management Systems', 'CS301', 'Relational database design, normalization, SQL, indexing, transaction processing, and ACID properties.'),
(2, 'Data Structures & Algorithms', 'CS201', 'Arrays, linked lists, trees, graphs, sorting, searching algorithms, and asymptotic complexity analysis.'),
(3, 'Operating Systems', 'CS302', 'Process scheduling, deadlocks, virtual memory management, file systems, and concurrency primitives.'),
(4, 'Computer Networks', 'CS401', 'OSI and TCP/IP protocol layers, routing protocols, TCP congestion control, DNS, and HTTP/HTTPS architecture.'),
(5, 'Web Technologies', 'CS501', 'Modern web architecture, HTML5, CSS3, JavaScript ES6+, RESTful APIs, Spring Boot, and React framework.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Initial Students and Admin
-- Note: Password is 'Password@123'
INSERT INTO students (id, name, email, password, department, year, role) VALUES
(1, 'System Administrator', 'admin@notesshare.com', '$2a$10$7Z8bU7E/Qv57kF9a2hR.e.P1/sBq1J7vYjX.q2m6k.U/yX3Y6aW5q', 'Computer Science', 4, 'ADMIN'),
(2, 'Deva', 'deva@notesshare.com', '$2a$10$7Z8bU7E/Qv57kF9a2hR.e.P1/sBq1J7vYjX.q2m6k.U/yX3Y6aW5q', 'Computer Science', 3, 'STUDENT'),
(3, 'Ranjan', 'ranjan@notesshare.com', '$2a$10$7Z8bU7E/Qv57kF9a2hR.e.P1/sBq1J7vYjX.q2m6k.U/yX3Y6aW5q', 'Information Technology', 2, 'STUDENT')
ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email);

-- Reset auto-increment
ALTER TABLE subjects AUTO_INCREMENT = 6;
ALTER TABLE students AUTO_INCREMENT = 4;
