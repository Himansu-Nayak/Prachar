package com.prachar.qr;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface QRCodeRepository extends JpaRepository<QRCode, UUID> {

    Optional<QRCode> findByCodeUuid(String codeUuid);

    Optional<QRCode> findByProfileId(UUID profileId);

    @Modifying
    @Query("UPDATE QRCode q SET q.scanCount = q.scanCount + 1 WHERE q.codeUuid = :codeUuid")
    int incrementScanCount(@Param("codeUuid") String codeUuid);
}
