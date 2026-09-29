package com.prachar.qr;

import com.prachar.profile.Profile;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "qr_scan_events", indexes = {
    @Index(name = "idx_qr_scan_events_qr_id", columnList = "qr_code_id"),
    @Index(name = "idx_qr_scan_events_profile_id", columnList = "profile_id"),
    @Index(name = "idx_qr_scan_events_scanned_at", columnList = "scanned_at")
})
@EntityListeners(AuditingEntityListener.class)
public class QRScanEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "qr_code_id", nullable = false)
    private QRCode qrCode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @CreatedDate
    @Column(name = "scanned_at", nullable = false, updatable = false)
    private Instant scannedAt;

    @Column(name = "ip_hash", length = 64)
    private String ipHash;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "referrer", length = 500)
    private String referrer;

    public QRScanEvent() {
    }

    public QRScanEvent(QRCode qrCode, Profile profile, String ipHash, String userAgent, String referrer) {
        this.qrCode = qrCode;
        this.profile = profile;
        this.ipHash = ipHash;
        this.userAgent = userAgent;
        this.referrer = referrer;
        this.scannedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public QRCode getQrCode() {
        return qrCode;
    }

    public void setQrCode(QRCode qrCode) {
        this.qrCode = qrCode;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public Instant getScannedAt() {
        return scannedAt;
    }

    public void setScannedAt(Instant scannedAt) {
        this.scannedAt = scannedAt;
    }

    public String getIpHash() {
        return ipHash;
    }

    public void setIpHash(String ipHash) {
        this.ipHash = ipHash;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getReferrer() {
        return referrer;
    }

    public void setReferrer(String referrer) {
        this.referrer = referrer;
    }
}
