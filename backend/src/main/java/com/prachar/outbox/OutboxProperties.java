package com.prachar.outbox;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "prachar.outbox")
public class OutboxProperties {

    private boolean enabled = true;
    private int batchSize = 20;
    private long fixedDelayMs = 5000;
    private int maxAttempts = 5;
    private long staleLockTimeoutSeconds = 300;
    private long baseRetryDelaySeconds = 2;
    private long maxRetryDelaySeconds = 3600;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getBatchSize() {
        return batchSize;
    }

    public void setBatchSize(int batchSize) {
        this.batchSize = batchSize;
    }

    public long getFixedDelayMs() {
        return fixedDelayMs;
    }

    public void setFixedDelayMs(long fixedDelayMs) {
        this.fixedDelayMs = fixedDelayMs;
    }

    public int getMaxAttempts() {
        return maxAttempts;
    }

    public void setMaxAttempts(int maxAttempts) {
        this.maxAttempts = maxAttempts;
    }

    public long getStaleLockTimeoutSeconds() {
        return staleLockTimeoutSeconds;
    }

    public void setStaleLockTimeoutSeconds(long staleLockTimeoutSeconds) {
        this.staleLockTimeoutSeconds = staleLockTimeoutSeconds;
    }

    public long getBaseRetryDelaySeconds() {
        return baseRetryDelaySeconds;
    }

    public void setBaseRetryDelaySeconds(long baseRetryDelaySeconds) {
        this.baseRetryDelaySeconds = baseRetryDelaySeconds;
    }

    public long getMaxRetryDelaySeconds() {
        return maxRetryDelaySeconds;
    }

    public void setMaxRetryDelaySeconds(long maxRetryDelaySeconds) {
        this.maxRetryDelaySeconds = maxRetryDelaySeconds;
    }
}
