package com.prachar.card;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.auth.DevOtpProvider;
import com.prachar.auth.OtpVerificationRepository;
import com.prachar.auth.RefreshTokenRepository;
import com.prachar.auth.dto.OtpRequestDto;
import com.prachar.auth.dto.OtpVerifyDto;
import com.prachar.card.dto.UpdateCardStatusDto;
import com.prachar.card.dto.UpdateDigitalCardDto;
import com.prachar.profile.ProfileRepository;
import com.prachar.profile.dto.CreateProfileRequestDto;
import com.prachar.qr.QRCodeRepository;
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

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DigitalCardIntegrationTest {

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
    private DigitalCardRepository digitalCardRepository;

    @Autowired
    private QRCodeRepository qrCodeRepository;

    @Autowired
    private OtpVerificationRepository otpVerificationRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @BeforeEach
    void cleanDatabase() {
        digitalCardRepository.deleteAll();
        qrCodeRepository.deleteAll();
        profileRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        otpVerificationRepository.deleteAll();
        userRepository.deleteAll();
    }

    private String authenticateUser(String phoneNumber) throws Exception {
        mockMvc.perform(post("/api/auth/otp/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestDto(phoneNumber))))
                .andExpect(status().isOk());

        String otp = devOtpProvider.getLastSentOtp(phoneNumber);

        MvcResult result = mockMvc.perform(post("/api/auth/otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyDto(phoneNumber, otp))))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Map<?, ?> responseMap = objectMapper.readValue(responseBody, Map.class);
        Map<?, ?> dataMap = (Map<?, ?>) responseMap.get("data");
        return (String) dataMap.get("accessToken");
    }

    private void createProfile(String token, String slug, String displayName) throws Exception {
        CreateProfileRequestDto dto = new CreateProfileRequestDto();
        dto.setUsernameSlug(slug);
        dto.setDisplayName(displayName);
        dto.setCategory("Retail Store");
        dto.setPrimaryPhone("+919178898844");
        dto.setCity("Bhubaneswar");

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Should successfully retrieve digital card for authenticated merchant")
    void testGetMyCardSuccess() throws Exception {
        String token = authenticateUser("+919178898844");
        createProfile(token, "bbsr-store", "Bhubaneswar Store");

        mockMvc.perform(get("/api/card/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.themeColor", is("#0F172A")))
                .andExpect(jsonPath("$.data.layoutType", is("STANDARD")))
                .andExpect(jsonPath("$.data.status", is("ACTIVE")))
                .andExpect(jsonPath("$.data.id", notNullValue()));
    }

    @Test
    @DisplayName("Should reject unauthenticated digital card retrieval with 401")
    void testGetMyCardUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/card/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.error.code", is("UNAUTHORIZED")));
    }

    @Test
    @DisplayName("Should return 404 when authenticated user has no profile")
    void testGetMyCardNoProfile() throws Exception {
        String token = authenticateUser("+919178898845");

        mockMvc.perform(get("/api/card/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.error.code", is("NOT_FOUND")));
    }

    @Test
    @DisplayName("Should update card visual identity and NFC status")
    void testUpdateMyCard() throws Exception {
        String token = authenticateUser("+919178898846");
        createProfile(token, "kalinga-handloom", "Kalinga Handloom");

        UpdateDigitalCardDto updateDto = new UpdateDigitalCardDto();
        updateDto.setThemeColor("#EA580C");
        updateDto.setLayoutType("COMPACT");
        updateDto.setIsNfcEnabled(true);
        updateDto.setStatus(CardStatus.ACTIVE);

        mockMvc.perform(put("/api/card/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.themeColor", is("#EA580C")))
                .andExpect(jsonPath("$.data.layoutType", is("COMPACT")))
                .andExpect(jsonPath("$.data.nfcEnabled", is(true)));
    }

    @Test
    @DisplayName("Should toggle digital card status between ACTIVE and INACTIVE")
    void testUpdateCardStatus() throws Exception {
        String token = authenticateUser("+919178898847");
        createProfile(token, "puri-sweets", "Puri Sweets");

        UpdateCardStatusDto statusDto = new UpdateCardStatusDto(CardStatus.INACTIVE);

        mockMvc.perform(patch("/api/card/me/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("INACTIVE")));

        // Toggle back to ACTIVE
        statusDto.setStatus(CardStatus.ACTIVE);
        mockMvc.perform(patch("/api/card/me/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("ACTIVE")));
    }

    @Test
    @DisplayName("Should reject invalid or null status payload with 400 Bad Request")
    void testUpdateCardStatusInvalid() throws Exception {
        String token = authenticateUser("+919178898848");
        createProfile(token, "odisha-crafts", "Odisha Crafts");

        mockMvc.perform(patch("/api/card/me/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.error.code", is("VALIDATION_FAILED")));
    }
}
