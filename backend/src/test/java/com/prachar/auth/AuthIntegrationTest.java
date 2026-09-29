package com.prachar.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.auth.dto.OtpRequestDto;
import com.prachar.auth.dto.OtpVerifyDto;
import com.prachar.auth.dto.RefreshTokenRequestDto;
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
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DevOtpProvider devOtpProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private final String testPhone = "+919178898844";

    @BeforeEach
    void setUp() {
        devOtpProvider.clear();
        refreshTokenRepository.deleteAll();
        otpRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Should successfully request OTP for valid Indian mobile number")
    void shouldRequestOtpSuccessfully() throws Exception {
        OtpRequestDto request = new OtpRequestDto(testPhone);

        mockMvc.perform(post("/api/auth/otp/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.message").exists());

        String sentOtp = devOtpProvider.getLastSentOtp(testPhone);
        assertNotNull(sentOtp, "DevOtpProvider should have recorded dispatched OTP");
    }

    @Test
    @DisplayName("Should reject invalid mobile number format")
    void shouldRejectInvalidMobileNumber() throws Exception {
        OtpRequestDto request = new OtpRequestDto("12345");

        mockMvc.perform(post("/api/auth/otp/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("VALIDATION_FAILED"));
    }

    @Test
    @DisplayName("Should enforce OTP rate-limiting after 3 requests in window")
    void shouldEnforceRateLimiting() throws Exception {
        OtpRequestDto request = new OtpRequestDto(testPhone);

        // 3 allowed requests
        for (int i = 0; i < 3; i++) {
            mockMvc.perform(post("/api/auth/otp/send")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());
        }

        // 4th request must be rejected with 400 Too many requests
        mockMvc.perform(post("/api/auth/otp/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.message", containsString("Too many OTP requests")));
    }

    @Test
    @DisplayName("Should verify valid OTP and issue Access & Refresh tokens")
    void shouldVerifyOtpAndAuthenticate() throws Exception {
        // Request OTP
        mockMvc.perform(post("/api/auth/otp/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestDto(testPhone))))
                .andExpect(status().isOk());

        String generatedOtp = devOtpProvider.getLastSentOtp(testPhone);

        // Verify OTP
        OtpVerifyDto verifyDto = new OtpVerifyDto(testPhone, generatedOtp);
        mockMvc.perform(post("/api/auth/otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isString())
                .andExpect(jsonPath("$.data.refreshToken").isString())
                .andExpect(jsonPath("$.data.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.data.phoneNumber").value(testPhone))
                .andExpect(jsonPath("$.data.hasProfile").value(false));
    }

    @Test
    @DisplayName("Should reject invalid OTP code")
    void shouldRejectInvalidOtpCode() throws Exception {
        mockMvc.perform(post("/api/auth/otp/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestDto(testPhone))))
                .andExpect(status().isOk());

        OtpVerifyDto wrongVerify = new OtpVerifyDto(testPhone, "000000");
        mockMvc.perform(post("/api/auth/otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wrongVerify)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.message", containsString("Invalid OTP")));
    }

    @Test
    @DisplayName("Should refresh access token using valid refresh token")
    void shouldRefreshAccessToken() throws Exception {
        // Request & verify OTP
        mockMvc.perform(post("/api/auth/otp/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestDto(testPhone))))
                .andExpect(status().isOk());

        String otp = devOtpProvider.getLastSentOtp(testPhone);
        MvcResult authResult = mockMvc.perform(post("/api/auth/otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyDto(testPhone, otp))))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = authResult.getResponse().getContentAsString();
        String refreshToken = objectMapper.readTree(responseBody).get("data").get("refreshToken").asText();

        // Refresh token call
        RefreshTokenRequestDto refreshDto = new RefreshTokenRequestDto(refreshToken);
        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isString());
    }

    @Test
    @DisplayName("Should retrieve current user session with valid Bearer token")
    void shouldGetMeWithValidToken() throws Exception {
        mockMvc.perform(post("/api/auth/otp/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestDto(testPhone))))
                .andExpect(status().isOk());

        String otp = devOtpProvider.getLastSentOtp(testPhone);
        MvcResult authResult = mockMvc.perform(post("/api/auth/otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyDto(testPhone, otp))))
                .andReturn();

        String token = objectMapper.readTree(authResult.getResponse().getContentAsString())
                .get("data").get("accessToken").asText();

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.phoneNumber").value(testPhone));
    }
}
