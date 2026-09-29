package com.prachar.auth;

import com.prachar.auth.dto.AuthResponseDto;
import com.prachar.auth.dto.OtpRequestDto;
import com.prachar.auth.dto.OtpVerifyDto;
import com.prachar.auth.dto.RefreshTokenRequestDto;
import com.prachar.profile.Profile;
import com.prachar.profile.ProfileRepository;
import com.prachar.user.Role;
import com.prachar.user.User;
import com.prachar.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final OtpService otpService;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthService(OtpService otpService,
                       UserRepository userRepository,
                       ProfileRepository profileRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       JwtTokenProvider jwtTokenProvider,
                       PasswordEncoder passwordEncoder) {
        this.otpService = otpService;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public void requestOtp(OtpRequestDto request) {
        otpService.requestOtp(request.getPhoneNumber());
    }

    @Transactional
    public AuthResponseDto verifyOtpAndAuthenticate(OtpVerifyDto request) {
        boolean verified = otpService.verifyOtp(request.getPhoneNumber(), request.getOtp());
        if (!verified) {
            throw new IllegalArgumentException("OTP verification failed.");
        }

        String normalizedPhone = otpService.normalizePhoneNumber(request.getPhoneNumber());

        User user = userRepository.findByPhoneNumber(normalizedPhone)
                .orElseGet(() -> {
                    User newUser = new User(normalizedPhone, Role.ROLE_USER);
                    return userRepository.save(newUser);
                });

        Optional<Profile> profileOpt = profileRepository.findByUserId(user.getId());
        boolean hasProfile = profileOpt.isPresent();
        String usernameSlug = profileOpt.map(Profile::getUsernameSlug).orElse(null);

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String rawRefreshToken = jwtTokenProvider.generateRawRefreshToken();

        // Invalidate prior refresh tokens and persist hashed new one
        refreshTokenRepository.revokeAllUserTokens(user.getId());

        String hashedRefreshToken = passwordEncoder.encode(rawRefreshToken);
        Instant expiry = jwtTokenProvider.getRefreshTokenExpiry();
        RefreshToken refreshTokenEntity = new RefreshToken(user, hashedRefreshToken, expiry);
        refreshTokenRepository.save(refreshTokenEntity);

        return new AuthResponseDto(
                accessToken,
                rawRefreshToken,
                900, // 15 minutes
                user.getId(),
                user.getPhoneNumber(),
                user.getRole().name(),
                hasProfile,
                usernameSlug
        );
    }

    @Transactional
    public AuthResponseDto refreshAccessToken(RefreshTokenRequestDto request) {
        String rawToken = request.getRefreshToken();
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token is required.");
        }

        // Find active valid refresh token across unrevoked tokens
        RefreshToken activeToken = refreshTokenRepository.findAll().stream()
                .filter(rt -> !rt.isRevoked() && rt.getExpiresAt().isAfter(Instant.now()))
                .filter(rt -> passwordEncoder.matches(rawToken, rt.getTokenHash()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired refresh token."));

        User user = activeToken.getUser();
        Optional<Profile> profileOpt = profileRepository.findByUserId(user.getId());
        boolean hasProfile = profileOpt.isPresent();
        String usernameSlug = profileOpt.map(Profile::getUsernameSlug).orElse(null);

        String newAccessToken = jwtTokenProvider.generateAccessToken(user);

        return new AuthResponseDto(
                newAccessToken,
                rawToken,
                900,
                user.getId(),
                user.getPhoneNumber(),
                user.getRole().name(),
                hasProfile,
                usernameSlug
        );
    }

    @Transactional
    public void logout(UUID userId) {
        if (userId != null) {
            refreshTokenRepository.revokeAllUserTokens(userId);
        }
    }
}
