package com.prachar.advertising;

import org.springframework.core.io.Resource;

/**
 * Immutable carrier record for securely resolved advertisement creative binary streams.
 *
 * @param resource      The Spring streaming Resource (e.g. UrlResource)
 * @param filename      The sanitized, header-safe filename for Content-Disposition
 * @param contentType   The validated, canonicalized MIME type (e.g. image/png, application/pdf)
 * @param contentLength The file length in bytes, or -1 if unknown
 */
public record StoredCreativeResource(
        Resource resource,
        String filename,
        String contentType,
        long contentLength
) {}
