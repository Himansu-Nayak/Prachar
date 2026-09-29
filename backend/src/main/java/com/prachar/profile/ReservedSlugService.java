package com.prachar.profile;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.regex.Pattern;

@Service
public class ReservedSlugService {

    private static final Pattern SLUG_PATTERN = Pattern.compile("^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$");

    private static final Set<String> RESERVED_SLUGS = Set.of(
            "admin", "administrator", "login", "signin", "register", "signup",
            "dashboard", "api", "about", "product", "services", "advertise",
            "blog", "demo", "contact", "qr", "u", "terms", "privacy", "prachar",
            "help", "support", "auth", "null", "undefined", "settings", "root",
            "user", "users", "card", "cards", "profile", "profiles", "bhubaneswar",
            "odisha", "system", "public", "private", "status", "health", "actuator"
    );

    public String normalizeSlug(String candidate) {
        if (candidate == null) {
            throw new IllegalArgumentException("Username slug cannot be null");
        }
        return candidate.trim().toLowerCase().replaceAll("[^a-z0-9-]", "-").replaceAll("-+", "-");
    }

    public boolean isReserved(String slug) {
        if (slug == null) {
            return false;
        }
        return RESERVED_SLUGS.contains(slug.trim().toLowerCase());
    }

    public boolean isValidFormat(String slug) {
        if (slug == null) {
            return false;
        }
        return SLUG_PATTERN.matcher(slug).matches();
    }

    public void validateSlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new IllegalArgumentException("Username slug cannot be empty.");
        }
        if (!isValidFormat(slug)) {
            throw new IllegalArgumentException("Username slug must be 3-30 characters, lowercase alphanumeric and hyphens, and cannot start or end with a hyphen.");
        }
        if (isReserved(slug)) {
            throw new IllegalArgumentException("The username '" + slug + "' is reserved by the platform and cannot be registered.");
        }
    }
}
