package com.notesshare.config;

import com.notesshare.entity.Role;
import com.notesshare.entity.Student;
import com.notesshare.entity.Subject;
import com.notesshare.repository.StudentRepository;
import com.notesshare.repository.SubjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            StudentRepository studentRepository,
            SubjectRepository subjectRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedSubjects();
        seedUsers();
    }

    private void seedSubjects() {
        if (subjectRepository.count() == 0) {
            logger.info("Seeding initial academic subjects...");
            List<Subject> subjects = List.of(
                    new Subject("Database Management Systems", "CS301", "Relational database design, normalization, SQL, indexing, transaction processing, and ACID properties."),
                    new Subject("Data Structures & Algorithms", "CS201", "Arrays, linked lists, trees, graphs, sorting, searching algorithms, and asymptotic complexity analysis."),
                    new Subject("Operating Systems", "CS302", "Process scheduling, deadlocks, virtual memory management, file systems, and concurrency primitives."),
                    new Subject("Computer Networks", "CS401", "OSI and TCP/IP protocol layers, routing protocols, TCP congestion control, DNS, and HTTP/HTTPS architecture."),
                    new Subject("Web Technologies", "CS501", "Modern web architecture, HTML5, CSS3, JavaScript ES6+, RESTful APIs, Spring Boot, and React framework.")
            );
            subjectRepository.saveAll(subjects);
            logger.info("Seeded {} subjects successfully.", subjects.size());
        }
    }

    private void seedUsers() {
        // Migrate existing demo accounts if present
        studentRepository.findByEmail("rahul@notesshare.com").ifPresent(user -> {
            user.setName("Deva");
            user.setEmail("deva@notesshare.com");
            studentRepository.save(user);
        });
        studentRepository.findByEmail("ananya@notesshare.com").ifPresent(user -> {
            user.setName("Ranjan");
            user.setEmail("ranjan@notesshare.com");
            studentRepository.save(user);
        });

        seedUser("admin@notesshare.com", "System Administrator", "Computer Science", 4, Role.ADMIN);
        seedUser("deva@notesshare.com", "Deva", "Computer Science", 3, Role.STUDENT);
        seedUser("ranjan@notesshare.com", "Ranjan", "Information Technology", 2, Role.STUDENT);
        logger.info("Demo users (Admin, Deva, Ranjan) synchronized with password 'Password@123'.");
    }

    private void seedUser(String email, String name, String department, int year, Role role) {
        String encodedPassword = passwordEncoder.encode("Password@123");
        studentRepository.findByEmail(email).ifPresentOrElse(
                user -> {
                    user.setName(name);
                    user.setPassword(encodedPassword);
                    user.setRole(role);
                    studentRepository.save(user);
                },
                () -> {
                    Student newUser = new Student(name, email, encodedPassword, department, year, role);
                    studentRepository.save(newUser);
                }
        );
    }
}
