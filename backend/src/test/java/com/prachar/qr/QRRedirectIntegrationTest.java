package com.prachar.qr;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.auth.DevOtpProvider;
import com.prachar.auth.OtpVerificationRepository;
import com.prachar.auth.RefreshTokenRepository;
import com.prachar.auth.dto.OtpRequestDto;
import com.prachar.auth.dto.OtpVerifyDto;
import com.prachar.card.DigitalCardRepository;
import com.prachar.profile.ProfileRepository;
import com.prachar.profile.ProfileStatus;
import com.prachar.profile.dto.CreateProfileRequestDto;
import com.prachar.profile.dto.UpdateProfileStatusRequestDto;
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

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class QRRedirectIntegrationTest {

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
    private QRScanEventRepository qrScanEventRepository;

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private String codeUuid;
    private String authToken;
    private final String testPhone = "+919937012345";

    @BeforeEach
    void setUp() throws Exception {
        devOtpProvider.clear();
        qrScanEventRepository.deleteAll();
        qrCodeRepository.deleteAll();
        digitalCardRepository.deleteAll();
        profileRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        otpRepository.deleteAll();
        userRepository.deleteAll();

        // Authenticate
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

        authToken = objectMapper.readTree(authResult.getResponse().getContentAsString())
                .get("data").get("accessToken").asText();

        // Create Profile
        CreateProfileRequestDto request = new CreateProfileRequestDto();
        request.setUsernameSlug("lingaraj-store");
        request.setDisplayName("Lingaraj General Store");
        request.setCategory("Retail Store");
        request.setPrimaryPhone(testPhone);

        MvcResult profileResult = mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        codeUuid = objectMapper.readTree(profileResult.getResponse().getContentAsString())
                .get("data").get("codeUuid").asText();
    }

    @Test
    @DisplayName("Should issue HTTP 302 Found redirect to public profile, increment scan count, and record hashed IP telemetry")
    void shouldRedirectAndIncrementScanCount() throws Exception {
        QRCode before = qrCodeRepository.findByCodeUuid(codeUuid).orElseThrow();
        assertEquals(0L, before.getScanCount());

        mockMvc.perform(get("/qr/" + codeUuid)
                        .header("X-Forwarded-For", "203.0.113.195")
                        .header("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)")
                        .header("Referer", "https://prachar.in/booklet"))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", "/u/lingaraj-store"));

        QRCode after = qrCodeRepository.findByCodeUuid(codeUuid).orElseThrow();
        assertEquals(1L, after.getScanCount());

        // Verify telemetry foundation event
        List<QRScanEvent> events = qrScanEventRepository.findByQrCodeId(after.getId());
        assertEquals(1, events.size());
        QRScanEvent event = events.get(0);

        // Verify IP address is hashed (SHA-256), NOT stored raw
        assertNotNull(event.getIpHash());
        assertNotEquals("203.0.113.195", event.getIpHash());
        assertEquals(64, event.getIpHash().length()); // SHA-256 hex is 64 chars
        assertTrue(event.getUserAgent().contains("iPhone"));
        assertEquals("https://prachar.in/booklet", event.getReferrer());
    }

    @Test
    @DisplayName("Should return 404 for nonexistent QR UUID")
    void shouldReturn404ForNonexistentQr() throws Exception {
        mockMvc.perform(get("/qr/" + UUID.randomUUID()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("Should generate valid PNG image for QR code")
    void shouldGenerateQrPng() throws Exception {
        mockMvc.perform(get("/api/qr/image/" + codeUuid))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_PNG_VALUE));
    }

    @Test
    @DisplayName("Should reject redirection when QR code status is INACTIVE")
    void shouldRejectScanForInactiveQr() throws Exception {
        // Deactivate QR code
        mockMvc.perform(patch("/api/qr/me/status")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "INACTIVE"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("INACTIVE"));

        // Attempt scan redirect -> 400 Bad Request
        mockMvc.perform(get("/qr/" + codeUuid))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("inactive")));
    }

    @Test
    @DisplayName("Should reject redirection when associated profile status is INACTIVE")
    void shouldRejectScanForInactiveProfile() throws Exception {
        // Deactivate profile
        UpdateProfileStatusRequestDto statusUpdate = new UpdateProfileStatusRequestDto();
        statusUpdate.setStatus(ProfileStatus.INACTIVE);

        mockMvc.perform(patch("/api/profiles/me/status")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isOk());

        // Attempt scan redirect -> 400 Bad Request
        mockMvc.perform(get("/qr/" + codeUuid))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("inactive")));
    }

    @Test
    @DisplayName("Should retrieve QR scan analytics summary (/api/qr/analytics)")
    void shouldFetchQrAnalytics() throws Exception {
        // Perform 2 scans
        mockMvc.perform(get("/qr/" + codeUuid)
                        .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"))
                .andExpect(status().isFound());

        mockMvc.perform(get("/qr/" + codeUuid)
                        .header("User-Agent", "Mozilla/5.0 (Android 14; Mobile)"))
                .andExpect(status().isFound());

        // Fetch analytics
        mockMvc.perform(get("/api/qr/analytics")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalScans").value(2))
                .andExpect(jsonPath("$.data.qrStatus").value("ACTIVE"))
                .andExpect(jsonPath("$.data.recentEvents", hasSize(2)));
    }
}

