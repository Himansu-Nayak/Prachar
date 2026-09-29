package com.prachar.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, UUID> {

    @Query("SELECT o FROM OtpVerification o WHERE o.phoneNumber = :phone AND o.consumed = false AND o.expiresAt > :now ORDER BY o.createdAt DESC LIMIT 1")
    Optional<OtpVerification> findLatestActiveOtp(@Param("phone") String phoneNumber, @Param("now") Instant now);

    @Query("SELECT COUNT(o) FROM OtpVerification o WHERE o.phoneNumber = :phone AND o.createdAt > :since")
    long countOtpsRequestedSince(@Param("phone") String phoneNumber, @Param("since") Instant since);
}
