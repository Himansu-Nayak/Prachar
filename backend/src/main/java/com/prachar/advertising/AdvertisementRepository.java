package com.prachar.advertising;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement, UUID> {

    List<Advertisement> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<Advertisement> findByIdAndUserId(UUID id, UUID userId);

    long countByUserId(UUID userId);

    long countByUserIdAndStatus(UUID userId, AdvertisementStatus status);

    List<Advertisement> findAllByOrderByCreatedAtDesc();

    List<Advertisement> findByStatusOrderByCreatedAtDesc(AdvertisementStatus status);

    long countByStatus(AdvertisementStatus status);
}
