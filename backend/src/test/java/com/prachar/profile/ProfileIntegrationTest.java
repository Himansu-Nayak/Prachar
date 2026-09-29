package com.prachar.profile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.auth.DevOtpProvider;
import com.prachar.auth.OtpVerificationRepository;
import com.prachar.auth.RefreshTokenRepository;
import com.prachar.auth.dto.OtpRequestDto;
import com.prachar.auth.dto.OtpVerifyDto;
import com.prachar.card.CardStatus;
import com.prachar.card.DigitalCardRepository;
import com.prachar.profile.dto.CreateProfileRequestDto;
import com.prachar.profile.dto.UpdateProfileRequestDto;
import com.prachar.profile.dto.UpdateProfileStatusRequestDto;
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
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
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
        jwtToken = authenticateUser(testPhone);
    }

    private String authenticateUser(String phone) throws Exception {
        mockMvc.perform(post("/api/auth/otp/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestDto(phone))))
                .andExpect(status().isOk());

        String otp = devOtpProvider.getLastSentOtp(phone);
        MvcResult authResult = mockMvc.perform(post("/api/auth/otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyDto(phone, otp))))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(authResult.getResponse().getContentAsString())
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
    @DisplayName("Should create profile with Phase 3 fields and initialize digital card and dynamic QR code")
    void shouldCreateProfileWithCardAndQr() throws Exception {
        CreateProfileRequestDto request = new CreateProfileRequestDto();
        request.setUsernameSlug("chandan-printers");
        request.setDisplayName("Chandan Printers Unit-3");
        request.setBusinessName("Chandan Offset Pvt Ltd");
        request.setCategory("Printing & Publishing");
        request.setPrimaryPhone(testPhone);
        request.setCity("Bhubaneswar");
        request.setDistrict("Khordha");
        request.setState("Odisha");
        request.setSocialInstagram("@chandanprinters");
        request.setThemeColor("#E11D48");

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.usernameSlug").value("chandan-printers"))
                .andExpect(jsonPath("$.data.displayName").value("Chandan Printers Unit-3"))
                .andExpect(jsonPath("$.data.businessName").value("Chandan Offset Pvt Ltd"))
                .andExpect(jsonPath("$.data.district").value("Khordha"))
                .andExpect(jsonPath("$.data.cardId").exists())
                .andExpect(jsonPath("$.data.themeColor").value("#E11D48"))
                .andExpect(jsonPath("$.data.qrId").exists())
                .andExpect(jsonPath("$.data.codeUuid").exists())
                .andExpect(jsonPath("$.data.targetUrl").value("/u/chandan-printers"));
    }

    @Test
    @DisplayName("Should retrieve authenticated user's profile (/api/profiles/me)")
    void shouldGetMyProfile() throws Exception {
        CreateProfileRequestDto request = new CreateProfileRequestDto();
        request.setUsernameSlug("lingaraj-hardware");
        request.setDisplayName("Lingaraj Hardware");
        request.setCategory("Hardware & Construction");
        request.setPrimaryPhone(testPhone);
        request.setCity("Bhubaneswar");

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/profiles/me")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.usernameSlug").value("lingaraj-hardware"))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                .andExpect(jsonPath("$.data.codeUuid").exists());
    }

    @Test
    @DisplayName("Should reject unauthenticated profile access")
    void shouldRejectUnauthenticatedProfileAccess() throws Exception {
        mockMvc.perform(get("/api/profiles/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should reject profile creation with duplicate slug (409 Conflict)")
    void shouldRejectDuplicateSlug() throws Exception {
        CreateProfileRequestDto request1 = new CreateProfileRequestDto();
        request1.setUsernameSlug("odisha-handloom");
        request1.setDisplayName("Odisha Handloom Store");
        request1.setCategory("Textiles");
        request1.setPrimaryPhone(testPhone);

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated());

        // Authenticate second user
        String token2 = authenticateUser("+919937099999");
        CreateProfileRequestDto request2 = new CreateProfileRequestDto();
        request2.setUsernameSlug("odisha-handloom");
        request2.setDisplayName("Another Handloom");
        request2.setCategory("Textiles");
        request2.setPrimaryPhone("+919937099999");

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + token2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.message", containsString("already taken")));
    }

    @Test
    @DisplayName("Should reject profile creation with invalid slug format")
    void shouldRejectInvalidSlug() throws Exception {
        CreateProfileRequestDto request = new CreateProfileRequestDto();
        request.setUsernameSlug("invalid_slug!");
        request.setDisplayName("Invalid Slug Test");
        request.setCategory("Services");
        request.setPrimaryPhone(testPhone);

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
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
    @DisplayName("Should reject profile creation with validation errors")
    void shouldRejectProfileCreationWithValidationErrors() throws Exception {
        CreateProfileRequestDto request = new CreateProfileRequestDto();
        request.setUsernameSlug("test-invalid");
        request.setDisplayName(""); // blank required display name
        request.setCategory("");
        request.setPrimaryPhone("123"); // invalid phone length

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("Should enforce profile ownership between separate users")
    void shouldEnforceProfileOwnership() throws Exception {
        CreateProfileRequestDto request1 = new CreateProfileRequestDto();
        request1.setUsernameSlug("owner-one");
        request1.setDisplayName("User One Store");
        request1.setCategory("Retail");
        request1.setPrimaryPhone(testPhone);

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated());

        String token2 = authenticateUser("+919937088888");
        CreateProfileRequestDto request2 = new CreateProfileRequestDto();
        request2.setUsernameSlug("owner-two");
        request2.setDisplayName("User Two Store");
        request2.setCategory("Services");
        request2.setPrimaryPhone("+919937088888");

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + token2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isCreated());

        // User 2 updating their own profile
        UpdateProfileRequestDto update = new UpdateProfileRequestDto();
        update.setDisplayName("User Two Updated");
        mockMvc.perform(put("/api/profiles/me")
                        .header("Authorization", "Bearer " + token2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.displayName").value("User Two Updated"));

        // Verify User 1's profile remains unchanged
        Profile profile1 = profileRepository.findByUsernameSlug("owner-one").orElseThrow();
        assertEquals("User One Store", profile1.getDisplayName());
    }

    @Test
    @DisplayName("Should fetch public profile with card and QR details")
    void shouldFetchPublicProfile() throws Exception {
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

    @Test
    @DisplayName("Should handle profile status lifecycle and safely sanitize public exposure when inactive")
    void shouldHandleProfileStatusLifecycleAndSafePublicExposure() throws Exception {
        CreateProfileRequestDto request = new CreateProfileRequestDto();
        request.setUsernameSlug("konark-cafe");
        request.setDisplayName("Konark Cafe");
        request.setCategory("Cafe & Bakery");
        request.setPrimaryPhone(testPhone);
        request.setEmail("cafe@konark.in");
        request.setAddressText("Master Canteen, Bhubaneswar");

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Deactivate profile
        UpdateProfileStatusRequestDto statusUpdate = new UpdateProfileStatusRequestDto();
        statusUpdate.setStatus(ProfileStatus.INACTIVE);

        mockMvc.perform(patch("/api/profiles/me/status")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("INACTIVE"));

        // Public retrieval must sanitize sensitive contact details
        mockMvc.perform(get("/api/profiles/public/konark-cafe"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("INACTIVE"))
                .andExpect(jsonPath("$.data.displayName").value("Konark Cafe"))
                .andExpect(jsonPath("$.data.primaryPhone").doesNotExist())
                .andExpect(jsonPath("$.data.email").doesNotExist())
                .andExpect(jsonPath("$.data.addressText").doesNotExist());

        // Reactivate profile
        statusUpdate.setStatus(ProfileStatus.ACTIVE);
        mockMvc.perform(patch("/api/profiles/me/status")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ACTIVE"));

        // Public retrieval now provides primary phone
        mockMvc.perform(get("/api/profiles/public/konark-cafe"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                .andExpect(jsonPath("$.data.primaryPhone").value(testPhone));
    }

    @Test
    @DisplayName("Should prevent user from reactivating profile when suspended by admin")
    void shouldPreventUserReactivationWhenSuspendedByAdmin() throws Exception {
        CreateProfileRequestDto request = new CreateProfileRequestDto();
        request.setUsernameSlug("suspended-biz");
        request.setDisplayName("Suspended Business");
        request.setCategory("Services");
        request.setPrimaryPhone(testPhone);

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Simulate admin suspending profile in database
        Profile profile = profileRepository.findByUsernameSlug("suspended-biz").orElseThrow();
        profile.setStatus(ProfileStatus.SUSPENDED);
        profileRepository.save(profile);

        // Public retrieval returns suspended status with sanitized data
        mockMvc.perform(get("/api/profiles/public/suspended-biz"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SUSPENDED"))
                .andExpect(jsonPath("$.data.primaryPhone").doesNotExist());

        // User attempts to reactivate suspended profile -> 403 Forbidden
        UpdateProfileStatusRequestDto statusUpdate = new UpdateProfileStatusRequestDto();
        statusUpdate.setStatus(ProfileStatus.ACTIVE);

        mockMvc.perform(patch("/api/profiles/me/status")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error.message", containsString("administrator")));
    }

    @Test
    @DisplayName("Should update digital card status and settings (/api/card/me)")
    void shouldUpdateCardStatusAndLifecycle() throws Exception {
        CreateProfileRequestDto request = new CreateProfileRequestDto();
        request.setUsernameSlug("card-test");
        request.setDisplayName("Card Test Merchant");
        request.setCategory("Retail");
        request.setPrimaryPhone(testPhone);

        mockMvc.perform(post("/api/profiles")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Update card status to INACTIVE
        mockMvc.perform(patch("/api/card/me/status")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "INACTIVE"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("INACTIVE"));

        // Update card NFC and theme
        mockMvc.perform(put("/api/card/me")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "isNfcEnabled", "true",
                                "themeColor", "#059669"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.nfcEnabled").value(true))
                .andExpect(jsonPath("$.data.themeColor").value("#059669"));
    }
}

