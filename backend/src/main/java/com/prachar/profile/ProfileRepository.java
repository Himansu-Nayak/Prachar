package com.prachar.profile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {

    Optional<Profile> findByUsernameSlug(String usernameSlug);

    Optional<Profile> findByUserId(UUID userId);

    boolean existsByUsernameSlug(String usernameSlug);
}
