package com.prachar.qr;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.prachar.profile.Profile;
import com.prachar.profile.ProfileRepository;
import com.prachar.profile.ProfileStatus;
import com.prachar.qr.dto.QRAnalyticsDto;
import com.prachar.qr.dto.QRScanEventSummaryDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class QRCodeService {

    private final QRCodeRepository qrCodeRepository;
    private final QRScanEventRepository qrScanEventRepository;
    private final ProfileRepository profileRepository;

    public QRCodeService(QRCodeRepository qrCodeRepository,
                         QRScanEventRepository qrScanEventRepository,
                         ProfileRepository profileRepository) {
        this.qrCodeRepository = qrCodeRepository;
        this.qrScanEventRepository = qrScanEventRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public QRCode resolveAndIncrement(String codeUuid) {
        return resolveAndIncrement(codeUuid, null, null, null);
    }

    @Transactional
    public QRCode resolveAndIncrement(String codeUuid, String clientIp, String userAgent, String referrer) {
        QRCode qrCode = qrCodeRepository.findByCodeUuid(codeUuid)
                .orElseThrow(() -> new EntityNotFoundException("QR Code '" + codeUuid + "' not found"));

        if (qrCode.getStatus() != QRStatus.ACTIVE) {
            throw new IllegalStateException("QR Code is currently inactive or suspended.");
        }

        Profile profile = qrCode.getProfile();
        if (profile != null && (profile.getStatus() != ProfileStatus.ACTIVE || !profile.isPublic())) {
            throw new IllegalStateException("Associated digital profile is currently inactive.");
        }

        qrCodeRepository.incrementScanCount(codeUuid);

        // Record privacy-preserving telemetry event
        if (profile != null) {
            String ipHash = hashIp(clientIp);
            String sanitizedUa = userAgent != null && userAgent.length() > 500 ? userAgent.substring(0, 500) : userAgent;
            String sanitizedRef = referrer != null && referrer.length() > 500 ? referrer.substring(0, 500) : referrer;

            QRScanEvent event = new QRScanEvent(qrCode, profile, ipHash, sanitizedUa, sanitizedRef);
            qrScanEventRepository.save(event);
        }

        return qrCode;
    }

    @Transactional
    public QRCode updateQrStatus(UUID userId, QRStatus newStatus) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for authenticated user."));

        QRCode qrCode = qrCodeRepository.findByProfileId(profile.getId())
                .orElseThrow(() -> new EntityNotFoundException("QR Code not found for profile."));

        qrCode.setStatus(newStatus);
        return qrCodeRepository.save(qrCode);
    }

    @Transactional(readOnly = true)
    public QRAnalyticsDto getAnalyticsSummary(UUID userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for authenticated user."));

        QRCode qrCode = qrCodeRepository.findByProfileId(profile.getId())
                .orElseThrow(() -> new EntityNotFoundException("QR Code not found for profile."));

        List<QRScanEvent> recentEvents = qrScanEventRepository.findTop10ByQrCodeIdOrderByScannedAtDesc(qrCode.getId());
        List<QRScanEventSummaryDto> eventDtos = recentEvents.stream().map(e -> {
            String device = parseDeviceFamily(e.getUserAgent());
            return new QRScanEventSummaryDto(e.getScannedAt(), device, e.getReferrer());
        }).collect(Collectors.toList());

        return new QRAnalyticsDto(qrCode.getScanCount(), qrCode.getStatus().name(), qrCode.getCodeUuid(), eventDtos);
    }

    public byte[] generateQrPng(String text, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, StandardCharsets.UTF_8.name());
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);
            hints.put(EncodeHintType.MARGIN, 1);

            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height, hints);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (Exception ex) {
            throw new RuntimeException("Failed to generate QR Code image: " + ex.getMessage(), ex);
        }
    }

    private String hashIp(String ip) {
        if (ip == null || ip.isBlank()) return null;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(ip.trim().getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return null;
        }
    }

    private String parseDeviceFamily(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) return "Unknown";
        String lower = userAgent.toLowerCase();
        if (lower.contains("iphone") || lower.contains("ipad")) return "Apple iOS";
        if (lower.contains("android")) return "Android Mobile";
        if (lower.contains("windows")) return "Windows Desktop";
        if (lower.contains("macintosh")) return "Mac Desktop";
        if (lower.contains("linux")) return "Linux";
        return "Mobile/Web";
    }
}
