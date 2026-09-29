package com.prachar.qr.dto;

import java.util.List;

public class QRAnalyticsDto {

    private long totalScans;
    private String qrStatus;
    private String codeUuid;
    private List<QRScanEventSummaryDto> recentEvents;

    public QRAnalyticsDto() {
    }

    public QRAnalyticsDto(long totalScans, String qrStatus, String codeUuid, List<QRScanEventSummaryDto> recentEvents) {
        this.totalScans = totalScans;
        this.qrStatus = qrStatus;
        this.codeUuid = codeUuid;
        this.recentEvents = recentEvents;
    }

    public long getTotalScans() {
        return totalScans;
    }

    public void setTotalScans(long totalScans) {
        this.totalScans = totalScans;
    }

    public String getQrStatus() {
        return qrStatus;
    }

    public void setQrStatus(String qrStatus) {
        this.qrStatus = qrStatus;
    }

    public String getCodeUuid() {
        return codeUuid;
    }

    public void setCodeUuid(String codeUuid) {
        this.codeUuid = codeUuid;
    }

    public List<QRScanEventSummaryDto> getRecentEvents() {
        return recentEvents;
    }

    public void setRecentEvents(List<QRScanEventSummaryDto> recentEvents) {
        this.recentEvents = recentEvents;
    }
}
