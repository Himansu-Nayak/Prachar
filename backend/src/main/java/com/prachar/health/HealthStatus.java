package com.prachar.health;

import java.time.Instant;

public class HealthStatus {

    private String status;
    private String environment;
    private String service;
    private Instant timestamp;

    public HealthStatus() {
        this.timestamp = Instant.now();
    }

    public HealthStatus(String status, String environment, String service) {
        this.status = status;
        this.environment = environment;
        this.service = service;
        this.timestamp = Instant.now();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
