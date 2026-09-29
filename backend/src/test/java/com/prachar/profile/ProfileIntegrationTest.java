package com.prachar.profile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.auth.DevOtpProvider;
import com.prachar.auth.OtpVerificationRepository;
import com.prachar.auth.RefreshTokenRepository;
import com.prachar.auth.dto.OtpRequestDto;
import com.prachar.auth.dto.OtpVerifyDto;
import com.prachar.card.DigitalCardRepository;
import com.prachar.profile.dto.CreateProfileRequestDto;
import com.prachar.profile.dto.UpdateProfileRequestDto;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProfileIntegrationTest {

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

    private final String testPhone = "+917077011733";
    private String jwtToken;

    @BeforeEach
    void setUp() throws Exception {
        devOtpProvider.clear();
        qrCodeRepository.deleteAll();
        digitalCardRepository.deleteAll();
        profileRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        otpRepository.deleteAll();
        userRepository.deleteAll();

        // Register and authenticate test user
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

        jwtToken = objectMapper.readTree(authResult.getResponse().getContentAsString())
                .get("data").get("accessToken").asText();
    }

    @Test
    @DisplayName("Should evaluate username availability correctly")
    void shouldCheckUsernameAvailability() throws Exception {
        // Available username
        mockMvc.perform(get("/api/profiles/claim/chandan-printers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.available").value(true));

        // Reserved username
        mockMvc.perform(get("/api/profiles/claim/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.available").value(false))
                .andExpect(jsonPath("$.data.message", containsString("reserved")));

        // Invalid format
        mockMvc.perform(get("/api/profiles/claim/a"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.available").value(false));
    }

    @Test
    @DisplayName("Should create profile and automatically initialize digital card and dynamic QR code")
    void shouldCreateProfileWithCardAndQr() throws Exception {
        CreateProfileRequestDto request = new CreateProfileRequestDto();
        request.setUsernameSlug("chandan-printers");
        request.setDisplayName("Chandan Printers Unit-3");
        request.setCategory("Printing & Publishing");
        request.setPrimaryPhone(testPhone);
        request.setCity("Bhubaneswar");
        request.setThemeColor("#E11D48");

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.usernameSlug").value("chandan-printers"))
                .andExpect(jsonPath("$.data.displayName").value("Chandan Printers Unit-3"))
                .andExpect(jsonPath("$.data.cardId").exists())
                .andExpect(jsonPath("$.data.themeColor").value("#E11D48"))
                .andExpect(jsonPath("$.data.qrId").exists())
                .andExpect(jsonPath("$.data.codeUuid").exists())
                .andExpect(jsonPath("$.data.targetUrl").value("/u/chandan-printers"));
    }

    @Test
    @DisplayName("Should reject profile creation with reserved slug")
    void shouldRejectReservedSlugCreation() throws Exception {
        CreateProfileRequestDto request = new CreateProfileRequestDto();
        request.setUsernameSlug("dashboard");
        request.setDisplayName("Test Dashboard");
        request.setCategory("Services");
        request.setPrimaryPhone(testPhone);

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.message", containsString("reserved")));
    }

    @Test
    @DisplayName("Should fetch public profile with card and QR details")
    void shouldFetchPublicProfile() throws Exception {
        // Create profile first
        CreateProfileRequestDto request = new CreateProfileRequestDto();
        request.setUsernameSlug("saroswati-khabar");
        request.setDisplayName("Saroswati Khabar BBSR");
        request.setCategory("News & Media");
        request.setPrimaryPhone(testPhone);
        request.setCity("Bhubaneswar");

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Public retrieval (unauthenticated)
        mockMvc.perform(get("/api/profiles/public/saroswati-khabar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.usernameSlug").value("saroswati-khabar"))
                .andExpect(jsonPath("$.data.displayName").value("Saroswati Khabar BBSR"))
                .andExpect(jsonPath("$.data.category").value("News & Media"))
                .andExpect(jsonPath("$.data.city").value("Bhubaneswar"))
                .andExpect(jsonPath("$.data.qrCodeUuid").isString());
    }

    @Test
    @DisplayName("Should update profile and digital card appearance")
    void shouldUpdateProfileAndCard() throws Exception {
        // Create profile
        CreateProfileRequestDto request = new CreateProfileRequestDto();
        request.setUsernameSlug("puri-sweets");
        request.setDisplayName("Puri Sweets");
        request.setCategory("Food & Hospitality");
        request.setPrimaryPhone(testPhone);

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Update profile
        UpdateProfileRequestDto update = new UpdateProfileRequestDto();
        update.setDisplayName("Puri Sweets & Restaurant");
        update.setTagline("Traditional Odia Sweets & Khaja");
        update.setThemeColor("#D97706");

        mockMvc.perform(put("/api/profiles/me")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.displayName").value("Puri Sweets & Restaurant"))
                .andExpect(jsonPath("$.data.tagline").value("Traditional Odia Sweets & Khaja"))
                .andExpect(jsonPath("$.data.themeColor").value("#D97706"));
    }
}
