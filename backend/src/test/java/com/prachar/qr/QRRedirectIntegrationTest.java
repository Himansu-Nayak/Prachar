package com.prachar.qr;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.auth.DevOtpProvider;
import com.prachar.auth.OtpVerificationRepository;
import com.prachar.auth.RefreshTokenRepository;
import com.prachar.auth.dto.OtpRequestDto;
import com.prachar.auth.dto.OtpVerifyDto;
import com.prachar.card.DigitalCardRepository;
import com.prachar.profile.ProfileRepository;
import com.prachar.profile.dto.CreateProfileRequestDto;
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

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
    private OtpVerificationRepository otpRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private String codeUuid;
    private final String testPhone = "+919937012345";

    @BeforeEach
    void setUp() throws Exception {
        devOtpProvider.clear();
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

        String token = objectMapper.readTree(authResult.getResponse().getContentAsString())
                .get("data").get("accessToken").asText();

        // Create Profile
        CreateProfileRequestDto request = new CreateProfileRequestDto();
        request.setUsernameSlug("lingaraj-store");
        request.setDisplayName("Lingaraj General Store");
        request.setCategory("Retail Store");
        request.setPrimaryPhone(testPhone);

        MvcResult profileResult = mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        codeUuid = objectMapper.readTree(profileResult.getResponse().getContentAsString())
                .get("data").get("codeUuid").asText();
    }

    @Test
    @DisplayName("Should issue HTTP 302 Found redirect to public profile and increment scan count")
    void shouldRedirectAndIncrementScanCount() throws Exception {
        QRCode before = qrCodeRepository.findByCodeUuid(codeUuid).orElseThrow();
        assertEquals(0L, before.getScanCount());

        mockMvc.perform(get("/qr/" + codeUuid))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", "/u/lingaraj-store"));

        QRCode after = qrCodeRepository.findByCodeUuid(codeUuid).orElseThrow();
        assertEquals(1L, after.getScanCount());
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
}
