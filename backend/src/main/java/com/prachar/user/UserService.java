package com.prachar.user;

import com.prachar.common.ResourceConflictException;
import com.prachar.profile.Profile;
import com.prachar.profile.ProfileRepository;
import com.prachar.user.dto.UpdateUserAccountRequestDto;
import com.prachar.user.dto.UserAccountResponseDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public UserService(UserRepository userRepository, ProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public UserAccountResponseDto getUserAccount(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User account not found: " + userId));

        Optional<Profile> profileOpt = profileRepository.findByUserId(userId);
        return mapToDto(user, profileOpt);
    }

    @Transactional
    public UserAccountResponseDto updateUserAccount(UUID userId, UpdateUserAccountRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User account not found: " + userId));

        if (request.getEmail() != null) {
            String trimmedEmail = request.getEmail().trim().toLowerCase();
            if (!trimmedEmail.isEmpty() && !trimmedEmail.equals(user.getEmail())) {
                userRepository.findByEmail(trimmedEmail).ifPresent(existing -> {
                    if (!existing.getId().equals(userId)) {
                        throw new ResourceConflictException("Email '" + trimmedEmail + "' is already registered to another account.");
                    }
                });
                user.setEmail(trimmedEmail);
            } else if (trimmedEmail.isEmpty()) {
                user.setEmail(null);
            }
        }

        User savedUser = userRepository.save(user);
        Optional<Profile> profileOpt = profileRepository.findByUserId(userId);
        return mapToDto(savedUser, profileOpt);
    }

    @Transactional
    public UserAccountResponseDto updateAccountStatus(UUID userId, AccountStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User account not found: " + userId));

        user.setAccountStatus(status);
        User savedUser = userRepository.save(user);
        Optional<Profile> profileOpt = profileRepository.findByUserId(userId);
        return mapToDto(savedUser, profileOpt);
    }

    @Transactional
    public UserAccountResponseDto updateOnboardingStatus(UUID userId, OnboardingStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User account not found: " + userId));

        user.setOnboardingStatus(status);
        User savedUser = userRepository.save(user);
        Optional<Profile> profileOpt = profileRepository.findByUserId(userId);
        return mapToDto(savedUser, profileOpt);
    }

    private UserAccountResponseDto mapToDto(User user, Optional<Profile> profileOpt) {
        UserAccountResponseDto dto = new UserAccountResponseDto();
        dto.setId(user.getId());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setAccountStatus(user.getAccountStatus() != null ? user.getAccountStatus().name() : AccountStatus.ACTIVE.name());
        dto.setOnboardingStatus(user.getOnboardingStatus() != null ? user.getOnboardingStatus().name() : OnboardingStatus.NOT_STARTED.name());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setHasProfile(profileOpt.isPresent());

        profileOpt.ifPresent(profile -> {
            dto.setUsernameSlug(profile.getUsernameSlug());
            dto.setDisplayName(profile.getDisplayName());
        });

        return dto;
    }
}
