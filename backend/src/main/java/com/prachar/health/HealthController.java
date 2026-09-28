package com.prachar.health;

import com.prachar.common.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @Value("${spring.application.name:prachar-backend}")
    private String applicationName;

    @GetMapping
    public ResponseEntity<ApiResponse<HealthStatus>> checkHealth() {
        HealthStatus health = new HealthStatus("UP", activeProfile, applicationName);
        return ResponseEntity.ok(ApiResponse.success(health, "PRACHAR backend is healthy"));
    }
}
