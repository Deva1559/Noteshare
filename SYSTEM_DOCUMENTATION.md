# NOTESSHARE – Comprehensive Technical & Architectural Documentation

---

## 1. System Overview

**NotesShare** is an enterprise-grade, full-stack academic notes sharing repository. It provides universities, colleges, and students with a structured platform to catalog, discover, peer-review, and distribute lecture notes, syllabus materials, and past exam guides.

### Core Architectural Principles
- **Decoupled Architecture**: Strict separation of concerns between client (React 18 Single Page Application) and server (Spring Boot 3 RESTful microservice).
- **Stateless Authentication**: Zero server-side session overhead using signed JSON Web Tokens (JJWT) with role-based access control (`ROLE_STUDENT`, `ROLE_ADMIN`).
- **Data Integrity & Relational Soundness**: Foreign key constraints with cascading rules, indexes, and composite unique constraints (`student_id`, `note_id`) preventing concurrency anomalies.
- **Resource Streaming & Local File Management**: Separation of lightweight database metadata (file name, type, size, download counts) from multi-megabyte binary documents stored securely on the local filesystem.
- **Modern Clean Design**: Professional white/light theme built with custom CSS design tokens, responsive CSS Grid, and accessible typography (Outfit and Inter).

---

## 2. Technology Stack

### Frontend Stack
| Tool / Library | Version | Role in Application |
| :--- | :--- | :--- |
| **React** | `18.2.0` | Declarative, component-based user interface |
| **Vite** | `5.2.11` | Next-generation bundler with Hot Module Replacement (HMR) |
| **React Router DOM** | `6.23.0` | Client-side routing, query parameter parsing, and route guards |
| **Axios** | `1.6.8` | HTTP client with Bearer token interceptor and global error handlers |
| **Lucide React** | `0.378.0`| Clean, scalable vector UI icons |
| **Modern Vanilla CSS**| CSS3 | Custom design system, responsive grid layouts, and light theme |

### Backend Stack
| Tool / Library | Version | Role in Application |
| :--- | :--- | :--- |
| **Spring Boot** | `3.2.5` | Enterprise application framework and container |
| **Java** | `17 LTS` | Core programming language (type safety, records, modern switch) |
| **Spring Security** | `6.x` | Stateless security filter chain, BCrypt hashing, and RBAC |
| **JJWT** | `0.11.5`| HMAC-SHA256 JWT creation, claims extraction, and validation |
| **Spring Data JPA** | `3.2.5` | Hibernate ORM, automated repository queries, and pagination |
| **MySQL Connector/J** | `8.0+` | Database connectivity driver |
| **Jakarta Validation** | `3.x` | Declarative request payload validation (`@NotBlank`, `@Min`, `@Max`) |
| **Springdoc OpenAPI** | `2.3.0` | Automated OpenAPI 3.0 specification & interactive Swagger UI |
| **JUnit 5 & Mockito** | `5.x / 5.x` | Unit testing for business logic, permissions, and duplicate checks |

---

## 3. Complete Folder & File Directory Breakdown

```
d:/project leap/
├── README.md                                 # Quickstart, viva defense, and run guide
├── SYSTEM_DOCUMENTATION.md                   # Complete architectural reference (this document)
├── .gitignore                                # Excludes node_modules, target/, binaries, and logs
│
├── database/                                 # SQL scripts for database lifecycle
│   ├── schema.sql                            # Full DDL for students, subjects, notes, and ratings
│   ├── sample-data.sql                       # Initial demo subjects and seed accounts
│   ├── check-data.sql                        # Comprehensive verification & inspection queries
│   └── update-student-names.sql              # Migration script to rename demo accounts to Deva & Ranjan
│
├── postman/
│   └── notesshare_api_collection.json        # 20+ ready-to-run Postman API tests with automated variables
│
├── uploads/notes/                            # Local directory for stored document binaries
│   └── .gitkeep                              # Preserves directory structure in version control
│
├── backend/                                  # Spring Boot 3 Java Maven project
│   ├── pom.xml                               # Project dependencies and plugins configuration
│   └── src/
│       ├── main/
│       │   ├── java/com/notesshare/
│       │   │   ├── NotesShareApplication.java
│       │   │   ├── config/                   # Configuration beans
│       │   │   │   ├── CorsConfig.java
│       │   │   │   ├── DataInitializer.java
│       │   │   │   ├── FileStorageConfig.java
│       │   │   │   └── OpenApiConfig.java
│       │   │   ├── controller/               # REST API presentation layer
│       │   │   │   ├── AdminController.java
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── NoteController.java
│       │   │   │   ├── RatingController.java
│       │   │   │   ├── StudentController.java
│       │   │   │   └── SubjectController.java
│       │   │   ├── dto/                      # Data Transfer Objects
│       │   │   │   ├── auth/
│       │   │   │   ├── common/
│       │   │   │   ├── note/
│       │   │   │   ├── rating/
│       │   │   │   ├── student/
│       │   │   │   └── subject/
│       │   │   ├── entity/                   # JPA database entities
│       │   │   │   ├── Note.java
│       │   │   │   ├── Rating.java
│       │   │   │   ├── Role.java
│       │   │   │   ├── Student.java
│       │   │   │   └── Subject.java
│       │   │   ├── exception/                # Global exception handling
│       │   │   │   ├── BadRequestException.java
│       │   │   │   ├── DuplicateRatingException.java
│       │   │   │   ├── ErrorResponse.java
│       │   │   │   ├── FileStorageException.java
│       │   │   │   ├── GlobalExceptionHandler.java
│       │   │   │   ├── ResourceNotFoundException.java
│       │   │   │   └── UnauthorizedActionException.java
│       │   │   ├── mapper/
│       │   │   │   └── NoteMapper.java
│       │   │   ├── repository/               # Data access interfaces
│       │   │   │   ├── NoteRepository.java
│       │   │   │   ├── RatingRepository.java
│       │   │   │   ├── StudentRepository.java
│       │   │   │   └── SubjectRepository.java
│       │   │   ├── security/                 # Security, JWT & UserDetails
│       │   │   │   ├── CustomUserDetails.java
│       │   │   │   ├── CustomUserDetailsService.java
│       │   │   │   ├── JwtAuthenticationFilter.java
│       │   │   │   ├── JwtService.java
│       │   │   │   └── SecurityConfig.java
│       │   │   ├── service/                  # Business logic services
│       │   │   │   ├── AdminService.java
│       │   │   │   ├── AuthService.java
│       │   │   │   ├── FileStorageService.java
│       │   │   │   ├── NoteService.java
│       │   │   │   ├── RatingService.java
│       │   │   │   ├── StudentService.java
│       │   │   │   └── SubjectService.java
│       │   │   └── util/
│       │   │       └── SecurityUtil.java
│       │   └── resources/
│       │       ├── application.properties
│       │       └── application-local.properties
│       └── test/java/com/notesshare/
│           ├── NotesShareApplicationTests.java
│           ├── NoteServiceTest.java
│           └── RatingServiceTest.java
│
└── frontend/                                 # React.js Vite client application
    ├── package.json                          # NPM dependencies & build scripts
    ├── vite.config.js                        # Vite dev server configuration & API proxy
    ├── index.html                            # HTML5 root with Google Fonts (Outfit & Inter)
    └── src/
        ├── App.jsx                           # Application router & protected routes
        ├── main.jsx                          # React DOM entrypoint
        ├── index.css                         # Clean white theme design tokens & component classes
        ├── components/                       # Reusable UI components
        │   ├── ErrorMessage.jsx
        │   ├── FilterPanel.jsx
        │   ├── LoadingSpinner.jsx
        │   ├── Navbar.jsx
        │   ├── NoteCard.jsx
        │   ├── NoteGrid.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── RatingStars.jsx
        │   └── SearchBar.jsx
        ├── context/
        │   └── AuthContext.jsx               # Global authentication provider
        ├── pages/                            # Application views
        │   ├── Dashboard.jsx
        │   ├── EditNote.jsx
        │   ├── Login.jsx
        │   ├── MyNotes.jsx
        │   ├── NoteDetails.jsx
        │   ├── Notes.jsx
        │   ├── Profile.jsx
        │   ├── Register.jsx
        │   ├── Subjects.jsx
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       ├── AdminNotes.jsx
        │       ├── AdminStudents.jsx
        │       └── AdminSubjects.jsx
        └── services/                         # Axios API integration modules
            ├── adminService.js
            ├── api.js
            ├── authService.js
            ├── noteService.js
            ├── ratingService.js
            ├── studentService.js
            └── subjectService.js
```

---

## 4. Frontend Component Breakdown

### 4.1 Reusable Components (`src/components/`)

#### 1. `Navbar.jsx`
- **Purpose**: Sticky header providing branding, global navigation, and responsive authentication state.
- **Features**:
  - Displays brand logo with book icon.
  - Links: Dashboard, Explore Notes, Subjects.
  - Unauthenticated view: Shows Login and Register buttons.
  - Authenticated view: Shows Upload, My Notes, Student Profile, and Logout.
  - Admin view: Dynamically reveals a dedicated purple "Admin" badge link if `user.role === 'ADMIN'`.

#### 2. `NoteCard.jsx`
- **Purpose**: Interactive card component representing a single note.
- **Props**:
  - `note`: Note object containing title, description, subject, unit, uploader, average rating, download count, and timestamps.
  - `onDownloadSuccess`: Optional callback executed after successful file download.
- **Features**:
  - Subject and Unit badges.
  - Title and truncated 3-line description.
  - Metadata icons: Uploader name, upload date, and attached file name.
  - Rating stars display with total review count.
  - Quick download button with local blob streaming.
  - Link to full Note Details page.

#### 3. `NoteGrid.jsx`
- **Purpose**: Responsive CSS grid container for rendering arrays of `NoteCard` elements.
- **Props**:
  - `notes`: Array of note objects.
  - `emptyMessage`: Custom text displayed when the array is empty.
- **Features**:
  - Grid automatically adjusts across desktop, tablet, and mobile screens.
  - Clean empty state with icon and helpful guidance when no notes match criteria.

#### 4. `SearchBar.jsx`
- **Purpose**: Search input with instant keyword submission.
- **Props**:
  - `onSearch`: Callback function receiving the submitted search query.
  - `initialValue`: Pre-filled query (syncs with URL query parameters).
- **Features**:
  - Search icon, clear button (`X`), and search action button.

#### 5. `FilterPanel.jsx`
- **Purpose**: Multi-criteria filtering and sorting control bar.
- **Props**:
  - `subjects`: List of academic subjects for dropdown selection.
  - `selectedSubject`, `onSubjectChange`: Subject filter state handler.
  - `selectedUnit`, `onUnitChange`: Unit filter state handler (Unit 1 to 8).
  - `sortBy`, `onSortChange`: Sort option (Newest, Oldest, Highest Rated, Most Downloaded).
  - `onReset`: Resets all filters back to default.

#### 6. `RatingStars.jsx`
- **Purpose**: Reusable star rating visualization and interactive rating control.
- **Props**:
  - `rating`: Numeric value (0 to 5).
  - `interactive`: Boolean enabling clickable hover stars for submitting reviews.
  - `onRate`: Callback function triggered with selected star rating (1–5).
  - `size`: Icon pixel dimensions.
  - `showValue`: Displays numeric average (e.g. `4.8`).

#### 7. `ProtectedRoute.jsx`
- **Purpose**: Client-side route wrapper preventing unauthorized access.
- **Props**:
  - `children`: Target page component.
  - `adminOnly`: Boolean restricting route to users with `ROLE_ADMIN`.
- **Behavior**:
  - If loading auth state: displays `LoadingSpinner`.
  - If unauthenticated: redirects to `/login` preserving intended destination in router state.
  - If `adminOnly` and user is a normal student: redirects to `/dashboard`.

#### 8. `LoadingSpinner.jsx`
- **Purpose**: Visual loading state indicator with CSS spin animation and status message.

#### 9. `ErrorMessage.jsx`
- **Purpose**: Dismissible red alert banner for displaying API error messages and validation failures.

---

### 4.2 Application Pages (`src/pages/`)

| Page | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| **`Dashboard.jsx`** | `/dashboard`, `/` | Public | Homepage displaying platform statistics (total notes, subjects, downloads), top-rated notes, recent uploads, and personal uploads. |
| **`Notes.jsx`** | `/notes` | Public | Explore catalog with keyword search, subject & unit filtering, sorting, and pagination controls. |
| **`NoteDetails.jsx`** | `/notes/:id` | Public | In-depth note view with document metadata, resource download trigger, interactive 1–5 star rating submission, and owner/admin delete/edit actions. |
| **`UploadNote.jsx`** | `/upload` | Authenticated | Form for uploading notes: title, subject dropdown, unit selector, description, and drag-and-drop document file selector. |
| **`EditNote.jsx`** | `/notes/:id/edit` | Owner / Admin | Allows updating title, subject, unit, description, and optionally replacing the attached document file. |
| **`MyNotes.jsx`** | `/my-notes` | Authenticated | Personal dashboard showing all notes uploaded by the logged-in student with direct edit and delete controls. |
| **`Profile.jsx`** | `/profile` | Authenticated | View student account details (name, email, role, department, year, registration date) and update profile info. |
| **`Subjects.jsx`** | `/subjects` | Public | Academic course subject catalog displaying course codes, names, syllabus descriptions, and note counts. |
| **`Login.jsx`** | `/login` | Public | Student/Admin login with credentials input and quick 1-click demo accounts (Deva, Ranjan, Admin). |
| **`Register.jsx`** | `/register` | Public | Student registration form collecting name, email, password, department, and academic year. |

---

### 4.3 Administrator Suite (`src/pages/admin/`)

| Admin Page | Route | Description |
| :--- | :--- | :--- |
| **`AdminDashboard.jsx`** | `/admin/dashboard` | Administrative overview displaying registered student count, total ratings, downloads, and a quick note moderation table. |
| **`AdminStudents.jsx`** | `/admin/students` | Paginated directory of all registered students with IDs, emails, departments, years, roles, and join dates. |
| **`AdminNotes.jsx`** | `/admin/notes` | Global note moderation view with search and direct administrative deletion capability. |
| **`AdminSubjects.jsx`** | `/admin/subjects` | Complete course management: Create new subjects, edit course codes/names, and delete subjects with modal dialogs. |

---

### 4.4 State & Services (`src/context/` & `src/services/`)

- **`AuthContext.jsx`**: Centralized authentication context provider. Exposes `user`, `token`, `isAuthenticated`, `isAdmin`, `login()`, `register()`, `logout()`, and `updateUser()`. Persists session in `localStorage`.
- **`api.js`**: Configured Axios instance with `baseURL: 'http://localhost:8080/api'`. Automatically intercepts outgoing requests to attach `Authorization: Bearer <token>` and intercepts 401 responses to handle session expiration.
- **`authService.js`**: Handles login, registration, and token persistence.
- **`noteService.js`**: Handles fetching notes, keyword searching, uploading multipart documents, updates, deletions, and triggering browser file downloads via Blob URLs.
- **`ratingService.js`**: Submits star ratings (1–5) and retrieves note review histories.
- **`subjectService.js`**: Retrieves subject listings and executes administrative subject creation/updates.
- **`studentService.js`**: Retrieves and updates user profiles and personal dashboard metrics.
- **`adminService.js`**: Retrieves admin KPI metrics, student directories, and executes note moderation.

---

## 5. Backend Architecture Breakdown

### 5.1 Layered Architecture Pattern
The backend is organized into a four-tier architecture:
1. **Controller Layer**: Exposes REST endpoints, consumes HTTP parameters, validates incoming DTOs using Jakarta Validation, and delegates to services.
2. **Service Layer**: Contains business logic, ownership enforcement, duplicate rating rejection, file storage coordination, and transaction management (`@Transactional`).
3. **Repository Layer**: Extends Spring Data JPA interfaces (`JpaRepository`, `JpaSpecificationExecutor`) providing database abstraction and optimized SQL generation.
4. **Entity / Database Layer**: Maps database tables to Java objects with Hibernate lifecycle annotations (`@PrePersist`, `@PreUpdate`).

---

### 5.2 Database Entities & Relationships (`com.notesshare.entity`)

#### 1. `Student.java`
- Table: `students`
- Fields: `id`, `name`, `email` (unique), `password` (BCrypt), `department`, `year`, `role` (`STUDENT`, `ADMIN`), `createdAt`, `updatedAt`.
- Relationships:
  - `@OneToMany` with `Note`: One student can upload multiple notes.
  - `@OneToMany` with `Rating`: One student can submit multiple ratings.

#### 2. `Subject.java`
- Table: `subjects`
- Fields: `id`, `name`, `code` (unique), `description`, `createdAt`, `updatedAt`.
- Relationships:
  - `@OneToMany` with `Note`: One subject contains many notes across units.

#### 3. `Note.java`
- Table: `notes`
- Fields: `id`, `title`, `description`, `unit`, `fileName`, `storedFileName`, `filePath`, `fileType`, `fileSize`, `downloadCount`, `averageRating`, `createdAt`, `updatedAt`.
- Relationships:
  - `@ManyToOne` with `Student` (uploader): Many notes belong to one student.
  - `@ManyToOne` with `Subject`: Many notes belong to one subject.
  - `@OneToMany` with `Rating`: One note has multiple ratings.

#### 4. `Rating.java`
- Table: `ratings`
- Fields: `id`, `ratingValue` (1 to 5), `createdAt`, `updatedAt`.
- Relationships:
  - `@ManyToOne` with `Student`: The student who rated.
  - `@ManyToOne` with `Note`: The note that was rated.
- **Critical Constraint**: `@UniqueConstraint(name = "uk_student_note", columnNames = {"student_id", "note_id"})`.

---

### 5.3 Security & Authentication (`com.notesshare.security`)

- **`JwtService.java`**:
  - Generates HMAC-SHA256 signed tokens using a 256-bit secret key.
  - Embeds claims: user ID, email, full name, and role.
  - Validates token authenticity and expiration (default: 24 hours).
- **`JwtAuthenticationFilter.java`**:
  - Extends `OncePerRequestFilter`.
  - Extracts `Authorization: Bearer <token>` header from incoming requests.
  - Validates token against `CustomUserDetailsService` and establishes security context in `SecurityContextHolder`.
- **`SecurityConfig.java`**:
  - Configures stateless session management (`SessionCreationPolicy.STATELESS`).
  - Disables CSRF (not needed for stateless REST APIs).
  - Configures explicit CORS source allowing all local origins (`http://localhost:*`, `http://127.0.0.1:*`).
  - Enforces Role-Based Access Control:
    - Public: `/api/auth/**`, `/api-docs/**`, `/swagger-ui/**`, `GET /api/subjects/**`, `GET /api/notes/**`, `GET /api/students/dashboard`.
    - Admin: `/api/admin/**`, `POST/PUT/DELETE /api/subjects/**`.
    - Authenticated: All note uploads, updates, deletions, and rating submissions.
  - Custom `AuthenticationEntryPoint` returning clean JSON on 401 Unauthorized.

---

### 5.4 File Storage Engine (`com.notesshare.service.FileStorageService`)

- **Physical Storage Location**: Configurable local directory (default: `uploads/notes/`).
- **Security & Path Traversal Defense**:
  - Sanitizes incoming file names using `StringUtils.cleanPath()`.
  - Rejects file names containing `..` to prevent directory traversal attacks.
- **Collision Protection**:
  - Generates safe UUID-prefixed file names: `UUID.randomUUID() + "_" + sanitizedName`.
- **Format Validation**:
  - Restricts uploads to permitted academic extensions: `pdf`, `doc`, `docx`, `ppt`, `pptx`, `txt`.
- **Download Delivery**:
  - Validates existence on disk and serves documents as Spring `UrlResource` with proper MIME headers and attachment filenames.
  - Deletes physical files from disk when a note is deleted or replaced.

---

### 5.5 Rating Algorithm & Duplicate Prevention

When a rating is submitted via `POST /api/notes/{noteId}/ratings`:
1. **Note Check**: Verifies that the note exists.
2. **Auth Check**: Extracts student ID from the security context.
3. **Range Check**: Validates that rating is an integer between 1 and 5 (rejects 0, negative, or > 5 with 400 Bad Request).
4. **Duplicate Protection**:
   - Queries `ratingRepository.existsByStudentIdAndNoteId(studentId, noteId)`.
   - If true: Immediately throws `DuplicateRatingException` returning HTTP 409 Conflict:
     ```json
     { "status": 409, "message": "You have already rated this note." }
     ```
5. **Persistence**: Saves the new rating entity.
6. **Transactional Recalculation**:
   - Calculates the average rating via database query: `SELECT AVG(r.ratingValue) FROM Rating r WHERE r.note.id = :noteId`.
   - Rounds to 1 decimal place (`RoundingMode.HALF_UP`).
   - Updates `note.setAverageRating(newAvg)`.
   - Saves updated note atomically within `@Transactional` boundary.

---

### 5.6 Global Exception Handling (`com.notesshare.exception`)

`GlobalExceptionHandler` (`@RestControllerAdvice`) maps all exceptions to a standardized JSON response:

```json
{
  "success": false,
  "status": 400,
  "error": "Bad Request",
  "message": "Detailed error explanation",
  "path": "/api/notes/...",
  "timestamp": "2026-09-29T09:20:00"
}
```

| Exception | HTTP Status | Scenario |
| :--- | :--- | :--- |
| `ResourceNotFoundException` | 404 Not Found | Subject, note, or student ID does not exist |
| `DuplicateRatingException` | 409 Conflict | Student attempts to rate the same note twice |
| `UnauthorizedActionException` | 403 Forbidden | Student attempts to edit/delete another student's note |
| `BadCredentialsException` | 401 Unauthorized| Wrong email or password during login |
| `AccessDeniedException` | 403 Forbidden | Non-admin student attempts to access `/api/admin/**` |
| `MethodArgumentNotValidException`| 400 Bad Request | Payload fails Jakarta validation (e.g. blank title) |
| `MaxUploadSizeExceededException`| 413 Payload Too Large | Uploaded document exceeds 50MB |
| `FileStorageException` | 500 Internal Error | File write or permission failure |

---

## 6. Database Schema & Data Dictionary

### Table: `students`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | PK, AUTO_INCREMENT | Unique student identifier |
| `name` | `VARCHAR(100)` | NOT NULL | Student's full name |
| `email` | `VARCHAR(150)` | NOT NULL, UNIQUE, INDEX | Login and contact email |
| `password` | `VARCHAR(255)` | NOT NULL | BCrypt hashed password |
| `department` | `VARCHAR(100)` | NULLABLE | Engineering branch (e.g. Computer Science) |
| `year` | `INT` | NULLABLE | Academic study year (1 to 4) |
| `role` | `VARCHAR(20)` | NOT NULL, INDEX | Authorization role (`STUDENT` or `ADMIN`) |
| `created_at` | `TIMESTAMP` | DEFAULT CURRENT_TIMESTAMP | Registration timestamp |
| `updated_at` | `TIMESTAMP` | ON UPDATE CURRENT_TIMESTAMP | Last profile update timestamp |

### Table: `subjects`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | PK, AUTO_INCREMENT | Unique subject identifier |
| `name` | `VARCHAR(150)` | NOT NULL | Course title (e.g. Database Management) |
| `code` | `VARCHAR(50)` | NOT NULL, UNIQUE, INDEX | Course code (e.g. CS301) |
| `description` | `TEXT` | NULLABLE | Course syllabus coverage details |
| `created_at` | `TIMESTAMP` | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | `TIMESTAMP` | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Table: `notes`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | PK, AUTO_INCREMENT | Unique note identifier |
| `title` | `VARCHAR(200)` | NOT NULL | Note headline |
| `description` | `TEXT` | NULLABLE | Summary of topics and units covered |
| `unit` | `INT` | NOT NULL, INDEX | Syllabus unit number (1 to 8) |
| `file_name` | `VARCHAR(255)` | NOT NULL | Original document filename |
| `stored_file_name`| `VARCHAR(255)` | NOT NULL | Safe UUID filename stored on disk |
| `file_path` | `VARCHAR(500)` | NOT NULL | Full path to file on disk |
| `file_type` | `VARCHAR(100)` | NOT NULL | MIME content type |
| `file_size` | `BIGINT` | NOT NULL | File size in bytes |
| `download_count` | `INT` | DEFAULT 0 | Cumulative download count |
| `average_rating` | `DOUBLE` | DEFAULT 0.0, INDEX | Calculated average rating (1.0 to 5.0) |
| `uploader_id` | `BIGINT` | FK -> `students(id)` ON DELETE CASCADE | Student who uploaded the note |
| `subject_id` | `BIGINT` | FK -> `subjects(id)` ON DELETE CASCADE | Academic course subject |
| `created_at` | `TIMESTAMP` | DEFAULT CURRENT_TIMESTAMP, INDEX | Upload timestamp |
| `updated_at` | `TIMESTAMP` | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Table: `ratings`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | PK, AUTO_INCREMENT | Unique rating identifier |
| `rating_value` | `INT` | NOT NULL, CHECK (1 <= val <= 5) | Stars submitted (1 to 5) |
| `student_id` | `BIGINT` | FK -> `students(id)` ON DELETE CASCADE | Student who rated |
| `note_id` | `BIGINT` | FK -> `notes(id)` ON DELETE CASCADE | Note that was rated |
| `created_at` | `TIMESTAMP` | DEFAULT CURRENT_TIMESTAMP | Submission timestamp |
| `updated_at` | `TIMESTAMP` | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |
| **UK Index** | `UNIQUE` | `(student_id, note_id)` | Enforces 1 rating per student per note |

---

## 7. Complete REST API Reference

### 7.1 Authentication Endpoints
- **`POST /api/auth/register`**
  - Payload: `{ "name": "...", "email": "...", "password": "...", "department": "...", "year": 3 }`
  - Response: `201 Created` with JWT token and student profile.
- **`POST /api/auth/login`**
  - Payload: `{ "email": "...", "password": "..." }`
  - Response: `200 OK` with JWT token, student ID, and role.

### 7.2 Student Profile Endpoints
- **`GET /api/students/me`** (Bearer Token)
  - Returns authenticated student details.
- **`PUT /api/students/me`** (Bearer Token)
  - Updates name, department, or academic year.
- **`GET /api/students/dashboard`** (Public / Authenticated)
  - Returns metrics: total notes, subjects, downloads, my notes count, top-rated notes, and recent uploads.

### 7.3 Academic Subjects Endpoints
- **`GET /api/subjects`** (Public)
  - Returns all subjects with code, name, description, and note count.
- **`GET /api/subjects/{id}`** (Public)
  - Returns single subject details.
- **`POST /api/subjects`** (Admin Only)
  - Creates a new course subject.
- **`PUT /api/subjects/{id}`** (Admin Only)
  - Updates subject name, code, or description.
- **`DELETE /api/subjects/{id}`** (Admin Only)
  - Deletes a subject and its associated notes.

### 7.4 Notes Management Endpoints
- **`GET /api/notes`** (Public)
  - Parameters: `keyword`, `subjectId`, `unit`, `page`, `size`, `sort` (e.g. `createdAt,desc` or `rating,desc`).
  - Returns paginated `PageResponse<NoteResponse>`.
- **`GET /api/notes/search?keyword=...`** (Public)
  - Search across title, description, subject name, and course code.
- **`GET /api/notes/top-rated`** (Public)
  - Returns the top 6 highest rated notes.
- **`GET /api/notes/recent`** (Public)
  - Returns the top 6 most recently uploaded notes.
- **`GET /api/notes/my-notes`** (Bearer Token)
  - Returns notes uploaded by the current student.
- **`GET /api/notes/{id}`** (Public)
  - Returns complete note details, rating statistics, and owner flag.
- **`POST /api/notes`** (Bearer Token, Multipart Form)
  - Parameters: `title`, `description`, `unit`, `subjectId`, `file`.
  - Stores file on disk, creates database record, returns `201 Created`.
- **`PUT /api/notes/{id}`** (Owner or Admin, Multipart Form)
  - Parameters: `title`, `description`, `unit`, `subjectId`, `file` (optional replacement).
  - Updates note metadata and replaces file if provided.
- **`DELETE /api/notes/{id}`** (Owner or Admin)
  - Deletes note record from MySQL and removes physical file from disk.
- **`GET /api/notes/{id}/download`** (Public)
  - Increments download counter in MySQL and streams file binary as `UrlResource` with `Content-Disposition: attachment`.

### 7.5 Ratings Endpoints
- **`POST /api/notes/{noteId}/ratings`** (Bearer Token)
  - Payload: `{ "rating": 5 }`
  - Validates duplicate check, saves rating, recalculates note average, and returns updated score.
- **`GET /api/notes/{noteId}/ratings`** (Public)
  - Returns review history for the note.

### 7.6 Administrator Endpoints
- **`GET /api/admin/dashboard`** (Admin Only)
  - Returns system KPIs: total students, notes, subjects, ratings, downloads, and recent uploads for moderation.
- **`GET /api/admin/students`** (Admin Only)
  - Returns paginated roster of all registered students.
- **`DELETE /api/admin/notes/{id}`** (Admin Only)
  - Moderates and removes inappropriate or copyrighted notes.

---

## 8. Step-by-Step Execution Guide

### Prerequisites
1. **Java 17 LTS**: `java -version`
2. **Maven 3.9+**: `mvn -v`
3. **Node.js 18+ & npm**: `node -v` and `npm -v`
4. **MySQL 8.0**: `Get-Service -Name *mysql*`

### Step 1: Start MySQL Database
Ensure MySQL is running and the database `notesshare_db` exists:
```sql
CREATE DATABASE IF NOT EXISTS notesshare_db;
```

### Step 2: Start Backend
```powershell
cd "d:\project leap\backend"
mvn spring-boot:run
```
- Server starts at: **`http://localhost:8080`**
- Swagger UI available at: **`http://localhost:8080/swagger-ui.html`**

### Step 3: Start Frontend
```powershell
cd "d:\project leap\frontend"
npm run dev
```
- Web Application opens at: **`http://localhost:5173`** (or `5174`)

---

## 9. Default Demo Accounts

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Admin** | System Administrator | `admin@notesshare.com` | `Password@123` |
| **Student 1** | Deva | `deva@notesshare.com` | `Password@123` |
| **Student 2** | Ranjan | `ranjan@notesshare.com` | `Password@123` |

*(Convenient 1-click demo login buttons are provided on the Login screen for instant evaluation).*
