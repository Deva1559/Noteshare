package com.notesshare.service;

import com.notesshare.config.FileStorageConfig;
import com.notesshare.exception.FileStorageException;
import com.notesshare.exception.ResourceNotFoundException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "pdf", "doc", "docx", "ppt", "pptx", "txt"
    );

    public FileStorageService(FileStorageConfig fileStorageConfig) {
        this.fileStorageLocation = Paths.get(fileStorageConfig.getUploadDir())
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the upload directory: " + fileStorageConfig.getUploadDir(), ex);
        }
    }

    public StoredFileInfo storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new FileStorageException("Failed to store empty file.");
        }

        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        // Prevent path traversal attack
        if (originalFileName.contains("..")) {
            throw new FileStorageException("Filename contains invalid path sequence: " + originalFileName);
        }

        // Validate file extension
        String extension = getFileExtension(originalFileName).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new FileStorageException("File extension ." + extension + " is not allowed. Allowed types: " + ALLOWED_EXTENSIONS);
        }

        // Generate safe unique stored filename
        String storedFileName = UUID.randomUUID().toString() + "_" + originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_");

        try {
            Path targetLocation = this.fileStorageLocation.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return new StoredFileInfo(
                    originalFileName,
                    storedFileName,
                    targetLocation.toString(),
                    file.getContentType() != null ? file.getContentType() : "application/octet-stream",
                    file.getSize()
            );
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + originalFileName + ". Please try again.", ex);
        }
    }

    public Resource loadFileAsResource(String storedFileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(storedFileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found on disk: " + storedFileName);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File path is invalid: " + storedFileName);
        }
    }

    public void deleteFile(String storedFileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(storedFileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            // Log warning but don't fail business transaction
            System.err.println("Warning: Could not delete physical file: " + storedFileName);
        }
    }

    private String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < fileName.length() - 1) {
            return fileName.substring(dotIndex + 1);
        }
        return "";
    }

    public static class StoredFileInfo {
        private final String originalFileName;
        private final String storedFileName;
        private final String filePath;
        private final String fileType;
        private final long fileSize;

        public StoredFileInfo(String originalFileName, String storedFileName, String filePath, String fileType, long fileSize) {
            this.originalFileName = originalFileName;
            this.storedFileName = storedFileName;
            this.filePath = filePath;
            this.fileType = fileType;
            this.fileSize = fileSize;
        }

        public String getOriginalFileName() {
            return originalFileName;
        }

        public String getStoredFileName() {
            return storedFileName;
        }

        public String getFilePath() {
            return filePath;
        }

        public String getFileType() {
            return fileType;
        }

        public long getFileSize() {
            return fileSize;
        }
    }
}
