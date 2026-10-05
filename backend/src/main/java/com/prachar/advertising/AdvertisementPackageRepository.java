package com.prachar.advertising;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdvertisementPackageRepository extends JpaRepository<AdvertisementPackage, UUID> {
    Optional<AdvertisementPackage> findByPackageCode(String packageCode);
    List<AdvertisementPackage> findByIsActiveTrueOrderBySingleEditionPriceAsc();
    boolean existsByPackageCode(String packageCode);
}
