package com.prachar.qr;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QRScanEventRepository extends JpaRepository<QRScanEvent, UUID> {
    long countByQrCodeId(UUID qrCodeId);
    long countByProfileId(UUID profileId);
    List<QRScanEvent> findByQrCodeId(UUID qrCodeId);
    List<QRScanEvent> findTop10ByProfileIdOrderByScannedAtDesc(UUID profileId);
    List<QRScanEvent> findTop10ByQrCodeIdOrderByScannedAtDesc(UUID qrCodeId);
}
