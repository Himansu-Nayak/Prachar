package com.prachar.onboarding;

import com.prachar.onboarding.dto.OnboardingStatusResponseDto;
import com.prachar.onboarding.dto.OnboardingStepDetailDto;
import com.prachar.profile.Profile;
import com.prachar.profile.ProfileRepository;
import com.prachar.user.AccountStatus;
import com.prachar.user.OnboardingStatus;
import com.prachar.user.User;
import com.prachar.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OnboardingService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public OnboardingService(UserRepository userRepository, ProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public OnboardingStatusResponseDto getOnboardingStatus(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        Optional<Profile> profileOpt = profileRepository.findByUserId(userId);
        boolean hasProfile = profileOpt.isPresent();

        OnboardingStatus status = user.getOnboardingStatus();
        if (hasProfile && status != OnboardingStatus.COMPLETED) {
            status = OnboardingStatus.COMPLETED;
        }

        boolean isCompleted = (status == OnboardingStatus.COMPLETED || hasProfile);
        int currentStep = computeCurrentStep(status, isCompleted);

        List<OnboardingStepDetailDto> steps = buildSteps(currentStep, isCompleted);

        OnboardingStatusResponseDto response = new OnboardingStatusResponseDto();
        response.setUserId(user.getId());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setOnboardingStatus(status != null ? status.name() : OnboardingStatus.NOT_STARTED.name());
        response.setAccountStatus(user.getAccountStatus() != null ? user.getAccountStatus().name() : AccountStatus.ACTIVE.name());
        response.setCurrentStep(currentStep);
        response.setCompleted(isCompleted);
        response.setHasProfile(hasProfile);
        response.setSteps(steps);

        profileOpt.ifPresent(p -> {
            response.setUsernameSlug(p.getUsernameSlug());
            response.setDisplayName(p.getDisplayName());
        });

        return response;
    }

    @Transactional
    public OnboardingStatusResponseDto updateOnboardingStatus(UUID userId, OnboardingStatus newStatus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        user.setOnboardingStatus(newStatus);
        userRepository.save(user);

        return getOnboardingStatus(userId);
    }

    private int computeCurrentStep(OnboardingStatus status, boolean isCompleted) {
        if (isCompleted) return 6;
        if (status == null) return 2;
        return switch (status) {
            case NOT_STARTED -> 2; // Step 1 (Phone verification) is already done
            case IN_PROGRESS -> 2;
            case PROFILE_CREATED -> 4;
            case CARD_CREATED -> 5;
            case QR_CREATED -> 6;
            case COMPLETED -> 6;
        };
    }

    private List<OnboardingStepDetailDto> buildSteps(int currentStep, boolean isCompleted) {
        List<OnboardingStepDetailDto> list = new ArrayList<>();

        list.add(new OnboardingStepDetailDto(
                1,
                "ACCOUNT_VERIFIED",
                "Mobile Verification",
                "Phone identity validated via OTP",
                true,
                false
        ));

        list.add(new OnboardingStepDetailDto(
                2,
                "BUSINESS_INFO",
                "Merchant Details",
                "Store name, category, and direct contact",
                isCompleted || currentStep > 2,
                !isCompleted && currentStep == 2
        ));

        list.add(new OnboardingStepDetailDto(
                3,
                "USERNAME_CLAIM",
                "Claim Vanity URL",
                "Unique prachar.in/u/:slug identifier",
                isCompleted || currentStep > 3,
                !isCompleted && currentStep == 3
        ));

        list.add(new OnboardingStepDetailDto(
                4,
                "DIGITAL_CARD",
                "Digital Card",
                "Theme color, layout, and NFC companion card",
                isCompleted || currentStep > 4,
                !isCompleted && currentStep == 4
        ));

        list.add(new OnboardingStepDetailDto(
                5,
                "DYNAMIC_QR",
                "Dynamic QR Code",
                "Smart vector matrix routing directly to identity profile",
                isCompleted || currentStep > 5,
                !isCompleted && currentStep == 5
        ));

        list.add(new OnboardingStepDetailDto(
                6,
                "PUBLISH_READY",
                "Ready for Publicity",
                "Presence live and ready for Bhubaneswar display",
                isCompleted,
                !isCompleted && currentStep == 6
        ));

        return list;
    }
}
