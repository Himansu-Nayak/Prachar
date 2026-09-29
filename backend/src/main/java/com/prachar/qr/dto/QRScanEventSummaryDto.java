package com.prachar.qr.dto;

import java.time.Instant;

public class QRScanEventSummaryDto {

    private Instant scannedAt;
    private String deviceFamily;
    private String referrer;

    public QRScanEventSummaryDto() {
    }

    public QRScanEventSummaryDto(Instant scannedAt, String deviceFamily, String referrer) {
        this.scannedAt = scannedAt;
        this.deviceFamily = deviceFamily;
        this.referrer = referrer;
    }

    public Instant getScannedAt() {
        return scannedAt;
    }

    public void setScannedAt(Instant scannedAt) {
        this.scannedAt = scannedAt;
    }

    public String getDeviceFamily() {
        return deviceFamily;
    }

    public void setDeviceFamily(String deviceFamily) {
        this.deviceFamily = deviceFamily;
    }

    public String getReferrer() {
        return referrer;
    }

    public void setReferrer(String referrer) {
        this.referrer = referrer;
    }
}
