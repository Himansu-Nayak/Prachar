package com.prachar.advertising;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class CreativeStorageService {

    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/png",
            "image/jpeg",
            "image/jpg",
            "application/pdf"
    );
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            ".png", ".jpg", ".jpeg", ".pdf"
    );

    private final Path storageDirectory;

    public CreativeStorageService() {
        this.storageDirectory = Paths.get("uploads", "creatives").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.storageDirectory);
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize creative upload storage directory", e);
        }
    }

    public CreativeMetadata storeCreative(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Upload file cannot be null or empty.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 10 MB limit.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file format. Only PNG, JPEG, and PDF creatives are accepted.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = "creative.png";
        }

        String sanitizedFilename = sanitizeFilename(originalFilename);
        String extension = extractExtension(sanitizedFilename);

        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file extension: " + extension);
        }

        String storageKey = UUID.randomUUID() + "-" + sanitizedFilename;
        Path targetPath = this.storageDirectory.resolve(storageKey).normalize();

        // Enforce path traversal protection
        if (!targetPath.startsWith(this.storageDirectory)) {
            throw new SecurityException("Illegal file storage path detected.");
        }

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store creative artwork: " + e.getMessage(), e);
        }

        return new CreativeMetadata(storageKey, sanitizedFilename, contentType, file.getSize());
    }

    private String sanitizeFilename(String filename) {
        // Strip path traversal attempts and special characters
        String clean = Paths.get(filename).getFileName().toString();
        return clean.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String extractExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex);
        }
        return "";
    }

    public static class CreativeMetadata {
        private final String storageKey;
        private final String originalFilename;
        private final String contentType;
        private final long fileSize;

        public CreativeMetadata(String storageKey, String originalFilename, String contentType, long fileSize) {
            this.storageKey = storageKey;
            this.originalFilename = originalFilename;
            this.contentType = contentType;
            this.fileSize = fileSize;
        }

        public String getStorageKey() {
            return storageKey;
        }

        public String getOriginalFilename() {
            return originalFilename;
        }

        public String getContentType() {
            return contentType;
        }

        public long getFileSize() {
            return fileSize;
        }
    }
}
