package com.prachar.qr;

import com.prachar.common.BaseEntity;
import com.prachar.profile.Profile;
import jakarta.persistence.*;

@Entity
@Table(name = "qr_codes", indexes = {
    @Index(name = "idx_qr_codes_code_uuid", columnList = "code_uuid")
})
public class QRCode extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false, unique = true)
    private Profile profile;

    @Column(name = "code_uuid", nullable = false, unique = true, length = 64)
    private String codeUuid;

    @Column(name = "target_url", nullable = false, length = 500)
    private String targetUrl;

    @Column(name = "scan_count", nullable = false)
    private long scanCount = 0L;

    public QRCode() {
    }

    public QRCode(Profile profile, String codeUuid, String targetUrl) {
        this.profile = profile;
        this.codeUuid = codeUuid;
        this.targetUrl = targetUrl;
        this.scanCount = 0L;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public String getCodeUuid() {
        return codeUuid;
    }

    public void setCodeUuid(String codeUuid) {
        this.codeUuid = codeUuid;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
    }

    public long getScanCount() {
        return scanCount;
    }

    public void setScanCount(long scanCount) {
        this.scanCount = scanCount;
    }
}
