package com.prachar.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.auth.DevOtpProvider;
import com.prachar.auth.OtpVerificationRepository;
import com.prachar.auth.RefreshTokenRepository;
import com.prachar.auth.dto.OtpRequestDto;
import com.prachar.auth.dto.OtpVerifyDto;
import com.prachar.user.dto.UpdateUserAccountRequestDto;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserAccountIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DevOtpProvider devOtpProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.prachar.profile.ProfileRepository profileRepository;

    @Autowired
    private com.prachar.card.DigitalCardRepository digitalCardRepository;

    @Autowired
    private com.prachar.qr.QRCodeRepository qrCodeRepository;

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private final String testPhone = "+919876543210";

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
    @DisplayName("Should retrieve authenticated user account details")
    void shouldRetrieveUserAccount() throws Exception {
        String token = authenticateAndGetToken(testPhone);

        mockMvc.perform(get("/api/user/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.phoneNumber").value(testPhone))
                .andExpect(jsonPath("$.data.role").value("ROLE_USER"))
                .andExpect(jsonPath("$.data.accountStatus").value("ACTIVE"))
                .andExpect(jsonPath("$.data.onboardingStatus").value("NOT_STARTED"))
                .andExpect(jsonPath("$.data.hasProfile").value(false));
    }

    @Test
    @DisplayName("Should reject unauthenticated access to /api/user/me with 401")
    void shouldRejectUnauthenticatedAccess() throws Exception {
        mockMvc.perform(get("/api/user/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("UNAUTHORIZED"));
    }

    @Test
    @DisplayName("Should update user email successfully")
    void shouldUpdateUserEmail() throws Exception {
        String token = authenticateAndGetToken(testPhone);

        UpdateUserAccountRequestDto request = new UpdateUserAccountRequestDto("merchant@prachar.in");

        mockMvc.perform(put("/api/user/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("merchant@prachar.in"));
    }

    @Test
    @DisplayName("Should reject duplicate email registration with conflict error")
    void shouldRejectDuplicateEmail() throws Exception {
        // Create user 1 with email
        String token1 = authenticateAndGetToken(testPhone);
        mockMvc.perform(put("/api/user/me")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateUserAccountRequestDto("taken@prachar.in"))))
                .andExpect(status().isOk());

        // Create user 2 and attempt to claim same email
        String phone2 = "+919876543211";
        String token2 = authenticateAndGetToken(phone2);
        mockMvc.perform(put("/api/user/me")
                        .header("Authorization", "Bearer " + token2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateUserAccountRequestDto("taken@prachar.in"))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.message", containsString("already registered")));
    }

    @Test
    @DisplayName("Should immediately reject disabled user account with 403 Forbidden")
    void shouldRejectDisabledAccount() throws Exception {
        String token = authenticateAndGetToken(testPhone);

        // Administratively disable account in database
        User user = userRepository.findByPhoneNumber(testPhone).orElseThrow();
        user.setAccountStatus(AccountStatus.DISABLED);
        userRepository.save(user);

        // Attempt access with existing token must fail with 403
        mockMvc.perform(get("/api/user/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("ACCOUNT_INACTIVE"));
    }

    @Test
    @DisplayName("Should immediately reject suspended user account with 403 Forbidden")
    void shouldRejectSuspendedAccount() throws Exception {
        String token = authenticateAndGetToken(testPhone);

        // Administratively suspend account in database
        User user = userRepository.findByPhoneNumber(testPhone).orElseThrow();
        user.setAccountStatus(AccountStatus.SUSPENDED);
        userRepository.save(user);

        // Attempt access with existing token must fail with 403
        mockMvc.perform(get("/api/user/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("ACCOUNT_INACTIVE"));
    }
}
