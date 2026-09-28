# NOTESSHARE – Student Notes Sharing Repository

A production-grade, full-stack academic web platform designed for university students to upload, organize, search, download, and rate lecture notes and course study materials in a centralized repository.

---

## 1. Project Overview & Problem Statement

### The Problem
In academic environments, students produce high-value handwritten and digital study summaries, question banks, and unit notes. However, these are predominantly shared through transient chat applications (WhatsApp, Telegram). This creates significant challenges:
- Notes become scattered across disparate chat groups and lost over time.
- Senior-year notes cannot easily be retrieved by junior batches.
- Students repeatedly ask each other for the exact same materials before exams.
- Lack of subject and unit categorization leads to disorganization.
- No peer quality rating or feedback system exists to identify high-yield materials.
- No ownership or administrative moderation exists against erroneous content.

### The Solution: NotesShare
**NotesShare** solves this by providing a unified, web-based repository where:
- Verified students can upload study materials organized by **Subject** and **Syllabus Unit**.
- Documents (PDF, DOCX, PPTX, TXT) are safely stored on the local file system with hashed filenames while metadata is cataloged in MySQL.
- Students can search, filter, preview, rate (1 to 5 stars), and download notes.
- Strict concurrency rules enforce that **each student can rate a note exactly once** with automatic average recalculation.
- Robust role-based access control (RBAC) ensures only uploaders or administrators can update or remove materials.

---

## 2. Core Features

1. **Authentication & Security:**
   - Registration and login with BCrypt password hashing.
   - Stateless JWT (JSON Web Token) authentication with 24-hour expiration.
   - Role-Based Access Control (`ROLE_STUDENT`, `ROLE_ADMIN`).
2. **Note Repository & Uploads:**
   - Upload academic notes with Title, Subject, Unit (1–8), and Description.
   - Local physical storage (`uploads/notes/`) with UUID-based collision protection.
   - Allowed file formats: PDF, Word (DOC/DOCX), PowerPoint (PPT/PPTX), Plain Text (TXT).
   - Maximum upload size: 50MB.
3. **Discovery, Search & Filtering:**
   - Full-text search across Title, Description, Subject Name, and Course Code.
   - Multi-criteria filtering by Subject and Unit.
   - Flexible sorting by Newest, Oldest, Highest Rated, and Most Downloaded.
   - Spring Data JPA pagination metadata (`content`, `totalPages`, `totalElements`, `first`, `last`).
4. **Peer Review & Rating Engine:**
   - Star rating from 1 to 5 stars.
   - Unique composite constraint `(student_id, note_id)` prevents duplicate rating attempts.
   - Real-time transactional recalculation of note's `averageRating`.
5. **Download Counter & Analytics:**
   - Automatic download counter incrementing upon document delivery via Spring's `Resource` API.
   - Dynamic dashboard presenting top-rated notes, recently added files, and personal upload statistics.
6. **Administrative Moderation:**
   - Administrative dashboard displaying system KPIs (total students, notes, subjects, ratings, downloads).
   - Subject curriculum management (Add, Edit, Delete subjects).
   - Direct content removal for copyright or inaccurate materials.

---

## 3. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | 18.2 / 5.2 | Dynamic Single Page Application (SPA) UI |
| **Icons & Styling** | Lucide React / Modern CSS | 0.378 | Responsive Glassmorphism design system |
| **HTTP Client** | Axios | 1.6.8 | REST communication with JWT interceptors |
| **Backend Framework**| Spring Boot | 3.2.5 | Enterprise Java REST API server |
| **Language** | Java | 17 LTS | High-performance, type-safe business logic |
| **Security** | Spring Security + JJWT | 6.x / 0.11.5 | Role-based JWT authentication filter |
| **Data Persistence** | Spring Data JPA / Hibernate| 3.2.5 | Object-Relational Mapping (ORM) & queries |
| **Database** | MySQL Server | 8.0+ | Relational storage with foreign keys & indexes |
| **Build Tools** | Apache Maven / npm | 3.9+ / 10+ | Dependency resolution and bundling |
| **Documentation** | Springdoc OpenAPI / Swagger | 2.3.0 | Interactive API documentation |

---

## 4. System Architecture

```
+-------------------------------------------------------------+
|                     Client Browser                          |
|             React 18 + React Router + Axios                 |
|               (Running on localhost:5173)                   |
+-------------------------------------------------------------+
                              |
                     HTTP / REST (JSON)
            Authorization: Bearer <JWT_TOKEN>
                              |
                              v
+-------------------------------------------------------------+
|                  Spring Boot 3.2 Application                |
|                    (Running on port 8080)                   |
|                                                             |
|  [Security Filter Chain] -> JwtAuthenticationFilter         |
|  [Controllers]           -> Auth, Note, Rating, Subject     |
|  [Services]              -> NoteService, RatingService      |
|  [Data Access]           -> Spring Data JPA Repositories    |
+-------------------------------------------------------------+
         |                                          |
         | Local File I/O                           | JDBC Connection
         v                                          v
+-----------------------+              +----------------------+
|  Local File System    |              |     MySQL Database   |
|   uploads/notes/      |              |     notesshare_db    |
| (PDF, DOCX, PPTX, TXT)|              |  students, subjects, |
+-----------------------+              |     notes, ratings   |
                                       +----------------------+
```

---

## 5. Database ER Diagram

```
+-------------------+             +-------------------+
|     STUDENTS      |             |     SUBJECTS      |
+-------------------+             +-------------------+
| PK  id            |             | PK  id            |
|     name          |             |     name          |
|     email (UK)    |             |     code (UK)     |
|     password      |             |     description   |
|     department    |             |     created_at    |
|     year          |             |     updated_at    |
|     role          |             +-------------------+
|     created_at    |                       |
|     updated_at    |                       | 1
+-------------------+                       |
      | 1            \ 1                    |
      |               \                     |
      | *              \ *                  | *
+-------------------+   +---------------------------------+
|     RATINGS       |   |             NOTES               |
+-------------------+   +---------------------------------+
| PK  id            |   | PK  id                          |
|     rating_value  |   |     title                       |
| FK  student_id    |---|     description                 |
| FK  note_id       |   |     unit                        |
|     created_at    |   |     file_name                   |
|     updated_at    |   |     stored_file_name            |
|                   |   |     file_path                   |
| UK(student, note) |   |     file_type                   |
+-------------------+   |     file_size                   |
                        |     download_count              |
                        |     average_rating              |
                        | FK  uploader_id                 |
                        | FK  subject_id                  |
                        |     created_at                  |
                        |     updated_at                  |
                        +---------------------------------+
```

---

## 6. Directory Structure

```
d:/project leap/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/notesshare/
│       │   │   ├── NotesShareApplication.java
│       │   │   ├── config/
│       │   │   │   ├── CorsConfig.java
│       │   │   │   ├── DataInitializer.java
│       │   │   │   ├── FileStorageConfig.java
│       │   │   │   └── OpenApiConfig.java
│       │   │   ├── controller/
│       │   │   │   ├── AdminController.java
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── NoteController.java
│       │   │   │   ├── RatingController.java
│       │   │   │   ├── StudentController.java
│       │   │   │   └── SubjectController.java
│       │   │   ├── dto/
│       │   │   │   ├── auth/ (LoginRequest, RegisterRequest, AuthResponse)
│       │   │   │   ├── common/ (ApiResponse, PageResponse, DashboardResponse, AdminDashboardResponse)
│       │   │   │   ├── note/ (CreateNoteRequest, UpdateNoteRequest, NoteResponse)
│       │   │   │   ├── rating/ (RatingRequest, RatingResponse)
│       │   │   │   ├── student/ (StudentResponse, UpdateProfileRequest)
│       │   │   │   └── subject/ (SubjectRequest, SubjectResponse)
│       │   │   ├── entity/ (Student, Subject, Note, Rating, Role)
│       │   │   ├── exception/ (GlobalExceptionHandler, ErrorResponse, etc.)
│       │   │   ├── mapper/ (NoteMapper)
│       │   │   ├── repository/ (StudentRepository, SubjectRepository, NoteRepository, RatingRepository)
│       │   │   ├── security/ (JwtService, JwtAuthenticationFilter, CustomUserDetails, SecurityConfig)
│       │   │   ├── service/ (AuthService, NoteService, RatingService, SubjectService, StudentService, FileStorageService, AdminService)
│       │   │   └── util/ (SecurityUtil)
│       │   └── resources/
│       │       ├── application.properties
│       │       └── application-local.properties
│       └── test/
│           └── java/com/notesshare/ (NoteServiceTest, RatingServiceTest, NotesShareApplicationTests)
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/ (Navbar, NoteCard, NoteGrid, SearchBar, FilterPanel, RatingStars, LoadingSpinner, ErrorMessage, ProtectedRoute)
│       ├── context/ (AuthContext.jsx)
│       ├── pages/ (Login, Register, Dashboard, Notes, NoteDetails, UploadNote, EditNote, MyNotes, Profile, Subjects)
│       │   └── admin/ (AdminDashboard, AdminStudents, AdminNotes, AdminSubjects)
│       └── services/ (api.js, authService.js, noteService.js, ratingService.js, subjectService.js, studentService.js, adminService.js)
│
├── database/
│   ├── schema.sql
│   └── sample-data.sql
│
└── postman/
    └── notesshare_api_collection.json
```

---

## 7. Prerequisites & Verification

Before running, verify that Java 17+, Maven, Node.js, and MySQL are installed on Windows:

```powershell
# 1. Verify Java (Must be version 17 or higher)
java -version

# 2. Verify Maven
mvn -v

# 3. Verify Node.js and npm
node -v
npm -v

# 4. Verify MySQL service is running
Get-Service -Name *mysql*
```

---

## 8. Database Setup

### Step 1: Open MySQL Command Line or MySQL Workbench
Log into your local MySQL server as `root`:
```powershell
mysql -u root -p
```
*(Enter your MySQL root password when prompted)*

### Step 2: Create the Database
```sql
CREATE DATABASE IF NOT EXISTS notesshare_db;
```

### Step 3: Run the Schema and Sample Data (Optional)
You can run the provided scripts or allow Spring Boot to auto-create and seed them automatically:
```powershell
# From the project root:
mysql -u root -p notesshare_db < database/schema.sql
mysql -u root -p notesshare_db < database/sample-data.sql
```

---

## 9. Backend Setup & Run

### Step 1: Configure Credentials
Open `backend/src/main/resources/application.properties`. If your MySQL password is not `root`, set your credentials via environment variables or edit the file:
```properties
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:your_mysql_password}
```

### Step 2: Compile & Run the Backend
Open a terminal in `backend/`:
```powershell
cd "d:\project leap\backend"

# Run tests
mvn test

# Start the Spring Boot server
mvn spring-boot:run
```
The backend will launch at **`http://localhost:8080`**.

### Step 3: Open Swagger UI
Open your browser and navigate to:
**`http://localhost:8080/swagger-ui.html`**

---

## 10. Frontend Setup & Run

### Step 1: Install Dependencies
Open a second terminal in `frontend/`:
```powershell
cd "d:\project leap\frontend"
npm install
```

### Step 2: Launch Vite Dev Server
```powershell
npm run dev
```
The React application will open at **`http://localhost:5173`**.

---

## 11. Default Seed Accounts

The application automatically seeds the database with initial accounts on startup:

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@notesshare.com` | `Password@123` | `ROLE_ADMIN` |
| **Student 1** | `rahul@notesshare.com` | `Password@123` | `ROLE_STUDENT` |
| **Student 2** | `ananya@notesshare.com` | `Password@123` | `ROLE_STUDENT` |

*(Quick demo login buttons are also provided on the Login page for one-click testing)*

---

## 12. REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new student account |
| `POST` | `/api/auth/login` | Public | Authenticate and obtain JWT token |
| `GET` | `/api/students/me` | Authenticated | Retrieve current user profile |
| `PUT` | `/api/students/me` | Authenticated | Update current student profile |
| `GET` | `/api/students/dashboard` | Authenticated | Student dashboard statistics |
| `GET` | `/api/subjects` | Public | List all course subjects |
| `GET` | `/api/subjects/{id}` | Public | Get subject by ID |
| `POST` | `/api/subjects` | Admin Only | Add new subject |
| `PUT` | `/api/subjects/{id}` | Admin Only | Update subject details |
| `DELETE`| `/api/subjects/{id}` | Admin Only | Delete subject |
| `GET` | `/api/notes` | Public | Paginated list with keyword, subject, unit filters |
| `GET` | `/api/notes/{id}` | Public | Get single note metadata |
| `POST` | `/api/notes` | Authenticated | Upload note with multipart document |
| `PUT` | `/api/notes/{id}` | Owner/Admin | Update note metadata & optional document |
| `DELETE`| `/api/notes/{id}` | Owner/Admin | Remove note and local file |
| `GET` | `/api/notes/{id}/download` | Public | Increment counter and download document |
| `POST` | `/api/notes/{id}/ratings` | Authenticated | Submit rating (1–5 stars, duplicate rejected) |
| `GET` | `/api/admin/dashboard` | Admin Only | System-wide statistics |
| `GET` | `/api/admin/students` | Admin Only | Paginated student roster |
| `DELETE`| `/api/admin/notes/{id}` | Admin Only | Moderate and remove note |

---

## 13. College Viva & Technical Defense Guide

### Why React.js?
React enables a responsive Single Page Application (SPA) architecture with a virtual DOM, component reusability, and dynamic state management (AuthContext). This prevents full page reloads when filtering notes, rating materials, or uploading documents.

### Why Spring Boot?
Spring Boot provides an enterprise-ready, production-grade Java ecosystem with built-in dependency injection, transaction management (`@Transactional`), declarative validation (`jakarta.validation`), and mature security (`Spring Security`).

### Why MySQL & Spring Data JPA?
- **Relational Integrity**: Academic notes are inherently relational (Students upload Notes; Notes belong to Subjects; Students submit Ratings on Notes). Foreign keys and composite unique constraints guarantee consistency.
- **Spring Data JPA**: Eliminates repetitive boilerplate SQL queries, prevents SQL injection through prepared statements, and allows easy pagination and specifications.

### Why JWT (JSON Web Token)?
JWT enables stateless authentication. The Spring Boot backend does not need to maintain server-side HTTP sessions in memory. Every request carries an encrypted, signed token in the `Authorization: Bearer <token>` header, making the REST API scalable.

### Why DTOs (Data Transfer Objects)?
1. **Security**: Prevents exposing internal entity fields (like password hashes or internal file paths).
2. **Decoupling**: Separates the database schema from the API contract, preventing circular JSON serialization errors during `@ManyToOne` / `@OneToMany` relationships.

### Why store files on the file system instead of MySQL BLOB?
Storing multi-megabyte binary documents inside relational databases causes database bloat, degrades buffer pool performance, slows down backups, and increases memory overhead. Storing files on the local filesystem (`uploads/notes/`) with UUID-based stored filenames while keeping lightweight metadata (file name, type, size, path) in MySQL is the recommended production architecture.

### How is duplicate rating prevented?
Enforced at two independent defense layers:
1. **Service Layer**: Checks `ratingRepository.existsByStudentIdAndNoteId(studentId, noteId)`. If true, rejects with `DuplicateRatingException` returning HTTP 409 Conflict.
2. **Database Layer**: A composite unique constraint `UNIQUE KEY uk_student_note (student_id, note_id)` prevents concurrent race conditions.

### How is ownership and authorization verified?
When updating or deleting a note:
1. The service retrieves the authenticated user's ID from `SecurityContextHolder`.
2. It compares `note.getUploader().getId()` with the current user ID.
3. If neither the owner nor an administrator (`ROLE_ADMIN`), it halts execution and throws `UnauthorizedActionException`, returning HTTP 403 Forbidden.
