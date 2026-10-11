package com.prachar.advertising;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
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
    private final AdvertisementRepository advertisementRepository;

    @Autowired
    public CreativeStorageService(
            AdvertisementRepository advertisementRepository,
            @Value("${app.storage.creatives-dir:uploads/creatives}") String configuredDir) {
        this.advertisementRepository = advertisementRepository;
        this.storageDirectory = Paths.get(configuredDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.storageDirectory);
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize creative upload storage directory", e);
        }
    }

    public CreativeStorageService(AdvertisementRepository advertisementRepository) {
        this(advertisementRepository, "uploads/creatives");
    }

    public Path getStorageDirectory() {
        return this.storageDirectory;
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

    public StoredCreativeResource loadCreativeResource(UUID advertisementId) {
        if (advertisementId == null) {
            throw new IllegalArgumentException("Advertisement ID cannot be null.");
        }
        Advertisement ad = advertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new EntityNotFoundException("Advertisement with ID " + advertisementId + " was not found."));
        return loadCreativeResource(ad);
    }

    public StoredCreativeResource loadCreativeResource(Advertisement ad) {
        if (ad == null) {
            throw new IllegalArgumentException("Advertisement entity cannot be null.");
        }
        String storageKey = ad.getCreativeStorageKey();
        if (storageKey == null || storageKey.isBlank()) {
            throw new EntityNotFoundException("No creative artwork is attached to advertisement with ID " + ad.getId());
        }

        // Strict traversal checks: reject traversal sequences or disallowed characters
        if (storageKey.contains("..") || storageKey.contains("/") || storageKey.contains("\\") || storageKey.contains(":") || !storageKey.matches("^[a-zA-Z0-9._-]+$")) {
            throw new SecurityException("Illegal file storage key detected: invalid characters or path traversal attempt.");
        }

        Path targetPath = this.storageDirectory.resolve(storageKey).normalize();

        // Enforce path traversal protection against configured root
        if (!targetPath.startsWith(this.storageDirectory)) {
            throw new SecurityException("Illegal file storage path detected: target path escapes root directory.");
        }

        if (!Files.exists(targetPath) || !Files.isRegularFile(targetPath) || !Files.isReadable(targetPath)) {
            throw new EntityNotFoundException("Creative artwork file for advertisement " + ad.getId() + " is missing or inaccessible on server storage.");
        }

        Resource resource;
        try {
            resource = new UrlResource(targetPath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new EntityNotFoundException("Creative resource could not be read for advertisement " + ad.getId());
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Malformed URI for creative file: " + targetPath, e);
        }

        long fileSize;
        try {
            fileSize = Files.size(targetPath);
        } catch (IOException e) {
            fileSize = ad.getCreativeFileSize() != null ? ad.getCreativeFileSize() : -1L;
        }

        String rawContentType = ad.getCreativeContentType();
        String validatedContentType = determineSafeContentType(rawContentType, targetPath);

        String originalFilename = ad.getCreativeFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = "creative-" + ad.getId() + getExtensionForContentType(validatedContentType);
        }
        String sanitizedFilename = sanitizeDownloadFilename(originalFilename);

        return new StoredCreativeResource(resource, sanitizedFilename, validatedContentType, fileSize);
    }

    private String determineSafeContentType(String rawContentType, Path targetPath) {
        if (rawContentType != null) {
            String lower = rawContentType.trim().toLowerCase();
            if ("image/png".equals(lower)) return "image/png";
            if ("image/jpeg".equals(lower) || "image/jpg".equals(lower)) return "image/jpeg";
            if ("application/pdf".equals(lower)) return "application/pdf";
        }

        try {
            String probed = Files.probeContentType(targetPath);
            if (probed != null) {
                String probedLower = probed.trim().toLowerCase();
                if ("image/png".equals(probedLower)) return "image/png";
                if ("image/jpeg".equals(probedLower) || "image/jpg".equals(probedLower)) return "image/jpeg";
                if ("application/pdf".equals(probedLower)) return "application/pdf";
            }
        } catch (IOException ignored) {}

        return MediaType.APPLICATION_OCTET_STREAM_VALUE;
    }

    private String sanitizeDownloadFilename(String filename) {
        String clean = Paths.get(filename).getFileName().toString();
        clean = clean.replaceAll("[^a-zA-Z0-9._-]", "_").trim();
        if (clean.isBlank()) {
            clean = "creative_artwork.bin";
        }
        return clean;
    }

    private String getExtensionForContentType(String contentType) {
        if ("image/png".equalsIgnoreCase(contentType)) return ".png";
        if ("image/jpeg".equalsIgnoreCase(contentType)) return ".jpg";
        if ("application/pdf".equalsIgnoreCase(contentType)) return ".pdf";
        return ".bin";
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
