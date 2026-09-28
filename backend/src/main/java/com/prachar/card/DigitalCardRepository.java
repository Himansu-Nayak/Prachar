package com.prachar.card;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DigitalCardRepository extends JpaRepository<DigitalCard, UUID> {

    Optional<DigitalCard> findByProfileId(UUID profileId);
}
