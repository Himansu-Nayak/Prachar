package com.prachar.onboarding;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.auth.DevOtpProvider;
import com.prachar.auth.OtpVerificationRepository;
import com.prachar.auth.RefreshTokenRepository;
import com.prachar.auth.dto.OtpRequestDto;
import com.prachar.auth.dto.OtpVerifyDto;
import com.prachar.onboarding.dto.UpdateOnboardingStepRequestDto;
import com.prachar.profile.ProfileRepository;
import com.prachar.profile.dto.CreateProfileRequestDto;
import com.prachar.user.OnboardingStatus;
import com.prachar.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OnboardingIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DevOtpProvider devOtpProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private com.prachar.card.DigitalCardRepository digitalCardRepository;

    @Autowired
    private com.prachar.qr.QRCodeRepository qrCodeRepository;

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private final String testPhone = "+919123456780";

    @BeforeEach
    void setUp() {
        devOtpProvider.clear();
        qrCodeRepository.deleteAll();
        digitalCardRepository.deleteAll();
        profileRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        otpRepository.deleteAll();
        userRepository.deleteAll();
    }

    private String authenticateAndGetToken(String phone) throws Exception {
        mockMvc.perform(post("/api/auth/otp/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestDto(phone))))
                .andExpect(status().isOk());

        String otp = devOtpProvider.getLastSentOtp(phone);
        MvcResult result = mockMvc.perform(post("/api/auth/otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyDto(phone, otp))))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString())
                .get("data").get("accessToken").asText();
    }

    @Test
    @DisplayName("Should retrieve initial onboarding status after registration")
    void shouldRetrieveInitialOnboardingStatus() throws Exception {
        String token = authenticateAndGetToken(testPhone);

        mockMvc.perform(get("/api/onboarding/status")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.onboardingStatus").value("NOT_STARTED"))
                .andExpect(jsonPath("$.data.currentStep").value(2))
                .andExpect(jsonPath("$.data.completed").value(false))
                .andExpect(jsonPath("$.data.hasProfile").value(false))
                .andExpect(jsonPath("$.data.steps", hasSize(6)))
                .andExpect(jsonPath("$.data.steps[0].completed").value(true))
                .andExpect(jsonPath("$.data.steps[1].current").value(true));
    }

    @Test
    @DisplayName("Should update onboarding step progression")
    void shouldUpdateOnboardingStep() throws Exception {
        String token = authenticateAndGetToken(testPhone);

        UpdateOnboardingStepRequestDto request = new UpdateOnboardingStepRequestDto(OnboardingStatus.IN_PROGRESS);

        mockMvc.perform(post("/api/onboarding/step")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.onboardingStatus").value("IN_PROGRESS"));
    }

    @Test
    @DisplayName("Should mark onboarding as completed when profile is created")
    void shouldCompleteOnboardingOnProfileCreation() throws Exception {
        String token = authenticateAndGetToken(testPhone);

        CreateProfileRequestDto profileReq = new CreateProfileRequestDto();
        profileReq.setUsernameSlug("lingaraj-traders");
        profileReq.setDisplayName("Lingaraj Traders");
        profileReq.setBusinessName("Lingaraj Traders Pvt Ltd");
        profileReq.setCategory("Retail Store & Supermarket");
        profileReq.setPrimaryPhone(testPhone);
        profileReq.setCity("Bhubaneswar");
        profileReq.setDistrict("Khordha");
        profileReq.setState("Odisha");
        profileReq.setThemeColor("#EA580C");

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profileReq)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/onboarding/status")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.onboardingStatus").value("COMPLETED"))
                .andExpect(jsonPath("$.data.completed").value(true))
                .andExpect(jsonPath("$.data.currentStep").value(6))
                .andExpect(jsonPath("$.data.hasProfile").value(true))
                .andExpect(jsonPath("$.data.usernameSlug").value("lingaraj-traders"));
    }

    @Test
    @DisplayName("Should reject unauthenticated onboarding status request")
    void shouldRejectUnauthenticatedRequest() throws Exception {
        mockMvc.perform(get("/api/onboarding/status"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("UNAUTHORIZED"));
    }
}
