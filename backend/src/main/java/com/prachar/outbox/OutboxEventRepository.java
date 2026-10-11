package com.prachar.outbox;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent, UUID> {

    List<OutboxEvent> findByStatusAndAvailableAtLessThanEqualOrderByCreatedAtAsc(
            OutboxStatus status,
            Instant now,
            Pageable pageable
    );

    @Modifying
    @Query("UPDATE OutboxEvent e SET e.status = com.prachar.outbox.OutboxStatus.PROCESSING, " +
           "e.lockedAt = :now, e.lockedBy = :workerId, e.updatedAt = :now " +
           "WHERE e.id = :id AND e.status = com.prachar.outbox.OutboxStatus.PENDING")
    int claimEvent(@Param("id") UUID id, @Param("workerId") String workerId, @Param("now") Instant now);

    @Modifying
    @Query("UPDATE OutboxEvent e SET e.status = com.prachar.outbox.OutboxStatus.DELIVERED, " +
           "e.processedAt = :now, e.lockedAt = null, e.lockedBy = null, e.lastError = null, e.updatedAt = :now " +
           "WHERE e.id = :id AND e.status = com.prachar.outbox.OutboxStatus.PROCESSING")
    int markDelivered(@Param("id") UUID id, @Param("now") Instant now);

    @Modifying
    @Query("UPDATE OutboxEvent e SET e.status = com.prachar.outbox.OutboxStatus.PENDING, " +
           "e.attemptCount = e.attemptCount + 1, e.availableAt = :nextAvailable, e.lastError = :lastError, " +
           "e.lockedAt = null, e.lockedBy = null, e.updatedAt = :now " +
           "WHERE e.id = :id AND e.status = com.prachar.outbox.OutboxStatus.PROCESSING")
    int scheduleRetry(
            @Param("id") UUID id,
            @Param("nextAvailable") Instant nextAvailable,
            @Param("lastError") String lastError,
            @Param("now") Instant now
    );

    @Modifying
    @Query("UPDATE OutboxEvent e SET e.status = com.prachar.outbox.OutboxStatus.FAILED, " +
           "e.attemptCount = e.attemptCount + 1, e.lastError = :lastError, " +
           "e.lockedAt = null, e.lockedBy = null, e.updatedAt = :now " +
           "WHERE e.id = :id AND e.status = com.prachar.outbox.OutboxStatus.PROCESSING")
    int markFailed(
            @Param("id") UUID id,
            @Param("lastError") String lastError,
            @Param("now") Instant now
    );

    @Query("SELECT e FROM OutboxEvent e WHERE e.status = com.prachar.outbox.OutboxStatus.PROCESSING " +
           "AND e.lockedAt < :staleThreshold ORDER BY e.lockedAt ASC")
    List<OutboxEvent> findStaleProcessingEvents(@Param("staleThreshold") Instant staleThreshold, Pageable pageable);

    @Modifying
    @Query("UPDATE OutboxEvent e SET e.status = com.prachar.outbox.OutboxStatus.PENDING, " +
           "e.attemptCount = e.attemptCount + 1, e.lockedAt = null, e.lockedBy = null, " +
           "e.lastError = 'Recovered from stale or crashed worker lease', e.updatedAt = :now " +
           "WHERE e.id = :id AND e.status = com.prachar.outbox.OutboxStatus.PROCESSING AND e.lockedAt < :staleThreshold")
    int recoverStaleEvent(
            @Param("id") UUID id,
            @Param("staleThreshold") Instant staleThreshold,
            @Param("now") Instant now
    );

    @Modifying
    @Query("UPDATE OutboxEvent e SET e.status = com.prachar.outbox.OutboxStatus.PENDING, " +
           "e.availableAt = :now, e.lockedAt = null, e.lockedBy = null, e.lastError = null, e.updatedAt = :now " +
           "WHERE e.id = :id AND (e.status = com.prachar.outbox.OutboxStatus.FAILED OR e.status = com.prachar.outbox.OutboxStatus.DEAD_LETTER)")
    int requeueFailedEvent(@Param("id") UUID id, @Param("now") Instant now);

    long countByStatus(OutboxStatus status);

    List<OutboxEvent> findByAggregateTypeAndAggregateIdOrderByCreatedAtAsc(String aggregateType, String aggregateId);

    List<OutboxEvent> findByEventTypeOrderByCreatedAtAsc(String eventType);

    Optional<OutboxEvent> findTopByStatusOrderByCreatedAtAsc(OutboxStatus status);
}
