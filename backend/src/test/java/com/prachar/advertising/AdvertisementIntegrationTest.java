package com.prachar.advertising;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prachar.auth.JwtTokenProvider;
import com.prachar.advertising.dto.AdminReviewRequestDto;
import com.prachar.advertising.dto.CreateAdvertisementRequestDto;
import com.prachar.advertising.dto.UpdateAdvertisementRequestDto;
import com.prachar.profile.Profile;
import com.prachar.profile.ProfileRepository;
import com.prachar.profile.ProfileStatus;
import com.prachar.user.AccountStatus;
import com.prachar.user.OnboardingStatus;
import com.prachar.user.Role;
import com.prachar.user.User;
import com.prachar.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdvertisementIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private AdvertisementRepository advertisementRepository;

    @Autowired
    private AdvertisementPackageRepository packageRepository;

    @Autowired
    private AdvertisementPackageService packageService;

    @Autowired
    private com.prachar.payment.PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private com.prachar.auth.RefreshTokenRepository refreshTokenRepository;

    private User merchantUserA;
    private String merchantTokenA;

    private User merchantUserB;
    private String merchantTokenB;

    private User adminUser;
    private String adminToken;

    private Profile merchantProfileA;

    @BeforeEach
    void setUp() {
        paymentTransactionRepository.deleteAll();
        advertisementRepository.deleteAll();
        profileRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
        packageService.initDefaultPackages();

        // Seed Merchant User A
        merchantUserA = new User("+919937011111", Role.ROLE_USER);
        merchantUserA.setOnboardingStatus(OnboardingStatus.COMPLETED);
        merchantUserA = userRepository.save(merchantUserA);
        merchantTokenA = jwtTokenProvider.generateAccessToken(merchantUserA);

        // Seed Merchant Profile A
        merchantProfileA = new Profile();
        merchantProfileA.setUser(merchantUserA);
        merchantProfileA.setUsernameSlug("lingaraj-hardware");
        merchantProfileA.setDisplayName("Lingaraj Hardware & Paints");
        merchantProfileA.setBusinessName("Lingaraj Hardware Pvt Ltd");
        merchantProfileA.setCategory("Hardware & Construction");
        merchantProfileA.setPrimaryPhone("+919937011111");
        merchantProfileA.setStatus(ProfileStatus.ACTIVE);
        merchantProfileA = profileRepository.save(merchantProfileA);

        // Seed Merchant User B
        merchantUserB = new User("+919937022222", Role.ROLE_USER);
        merchantUserB.setOnboardingStatus(OnboardingStatus.COMPLETED);
        merchantUserB = userRepository.save(merchantUserB);
        merchantTokenB = jwtTokenProvider.generateAccessToken(merchantUserB);

        // Seed Admin User
        adminUser = new User("+919937099999", Role.ROLE_ADMIN);
        adminUser.setOnboardingStatus(OnboardingStatus.COMPLETED);
        adminUser = userRepository.save(adminUser);
        adminToken = jwtTokenProvider.generateAccessToken(adminUser);
    }

    @AfterEach
    void tearDown() {
        paymentTransactionRepository.deleteAll();
        advertisementRepository.deleteAll();
        profileRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Should retrieve all 5 official packages with exact historical rate card pricing")
    void shouldRetrieveAllOfficialPackagesWithExactRateCardPricing() throws Exception {
        mockMvc.perform(get("/api/advertising/packages"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(5)))
                // P1: ₹550 / ₹1,500
                .andExpect(jsonPath("$.data[0].packageCode").value("P1"))
                .andExpect(jsonPath("$.data[0].singleEditionPrice").value(550.00))
                .andExpect(jsonPath("$.data[0].threeEditionPrice").value(1500.00))
                .andExpect(jsonPath("$.data[0].savingsAmount").value(150.00))
                // P2: ₹1,030 / ₹3,000
                .andExpect(jsonPath("$.data[1].packageCode").value("P2"))
                .andExpect(jsonPath("$.data[1].singleEditionPrice").value(1030.00))
                .andExpect(jsonPath("$.data[1].threeEditionPrice").value(3000.00))
                .andExpect(jsonPath("$.data[1].savingsAmount").value(90.00))
                // P3: ₹2,050 / ₹6,000
                .andExpect(jsonPath("$.data[2].packageCode").value("P3"))
                .andExpect(jsonPath("$.data[2].singleEditionPrice").value(2050.00))
                .andExpect(jsonPath("$.data[2].threeEditionPrice").value(6000.00))
                .andExpect(jsonPath("$.data[2].savingsAmount").value(150.00))
                // P4: ₹4,100 / ₹12,000
                .andExpect(jsonPath("$.data[3].packageCode").value("P4"))
                .andExpect(jsonPath("$.data[3].singleEditionPrice").value(4100.00))
                .andExpect(jsonPath("$.data[3].threeEditionPrice").value(12000.00))
                .andExpect(jsonPath("$.data[3].savingsAmount").value(300.00))
                // P5: ₹6,000 / ₹15,000
                .andExpect(jsonPath("$.data[4].packageCode").value("P5"))
                .andExpect(jsonPath("$.data[4].singleEditionPrice").value(6000.00))
                .andExpect(jsonPath("$.data[4].threeEditionPrice").value(15000.00))
                .andExpect(jsonPath("$.data[4].savingsAmount").value(3000.00));
    }

    @Test
    @DisplayName("Should evaluate publication cutoff schedule correctly")
    void shouldEvaluatePublicationCutoffScheduleCorrectly() throws Exception {
        mockMvc.perform(get("/api/advertising/cutoff"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.currentTargetEdition").isNotEmpty())
                .andExpect(jsonPath("$.data.threeEditionSchedule", hasSize(3)))
                .andExpect(jsonPath("$.data.message").isNotEmpty());
    }

    @Test
    @DisplayName("Should create advertisement draft with server-authoritative pricing for single edition")
    void shouldCreateAdvertisementDraftSingleEdition() throws Exception {
        CreateAdvertisementRequestDto request = new CreateAdvertisementRequestDto();
        request.setPackageCode("P1");
        request.setEditionCount(1);
        request.setHeadline("Grand Opening of Lingaraj Hardware");
        request.setAdText("Quality paints, tools and construction hardware in Saheed Nagar.");
        request.setContactPhone("+919937011111");
        request.setCity("Bhubaneswar");
        request.setProfileId(merchantProfileA.getId());

        mockMvc.perform(post("/api/advertising/advertisements")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.packageCode").value("P1"))
                .andExpect(jsonPath("$.data.editionCount").value(1))
                .andExpect(jsonPath("$.data.amount").value(550.00)) // Server authoritative
                .andExpect(jsonPath("$.data.status").value("DRAFT"))
                .andExpect(jsonPath("$.data.paymentStatus").value("PAYMENT_PENDING"))
                .andExpect(jsonPath("$.data.usernameSlug").value("lingaraj-hardware"))
                .andExpect(jsonPath("$.data.businessName").value("Lingaraj Hardware Pvt Ltd"));
    }

    @Test
    @DisplayName("Should create advertisement draft with 3-edition scheme discount pricing")
    void shouldCreateAdvertisementDraftThreeEditions() throws Exception {
        CreateAdvertisementRequestDto request = new CreateAdvertisementRequestDto();
        request.setPackageCode("P4");
        request.setEditionCount(3);
        request.setHeadline("Premium Summer Hardware Offer");
        request.setAdText("Exclusive commercial discounts available for contractors.");
        request.setContactPhone("+919937011111");

        mockMvc.perform(post("/api/advertising/advertisements")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.packageCode").value("P4"))
                .andExpect(jsonPath("$.data.editionCount").value(3))
                .andExpect(jsonPath("$.data.amount").value(12000.00)) // Exact P4 3-edition price
                .andExpect(jsonPath("$.data.status").value("DRAFT"));
    }

    @Test
    @DisplayName("Should reject invalid edition count not equal to 1 or 3")
    void shouldRejectInvalidEditionCount() throws Exception {
        CreateAdvertisementRequestDto request = new CreateAdvertisementRequestDto();
        request.setPackageCode("P1");
        request.setEditionCount(2); // Invalid edition count
        request.setHeadline("Invalid Edition Ad");
        request.setContactPhone("+919937011111");

        mockMvc.perform(post("/api/advertising/advertisements")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should prevent merchant from linking a profile owned by another merchant")
    void shouldPreventLinkingAnotherMerchantsProfile() throws Exception {
        CreateAdvertisementRequestDto request = new CreateAdvertisementRequestDto();
        request.setPackageCode("P1");
        request.setEditionCount(1);
        request.setHeadline("Tampering Test Ad");
        request.setContactPhone("+919937022222");
        request.setProfileId(merchantProfileA.getId()); // Owned by merchantUserA!

        mockMvc.perform(post("/api/advertising/advertisements")
                        .header("Authorization", "Bearer " + merchantTokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should enforce merchant isolation and prevent IDOR on read and update")
    void shouldEnforceMerchantIsolationAndPreventIdor() throws Exception {
        // Create ad for Merchant A
        CreateAdvertisementRequestDto request = new CreateAdvertisementRequestDto();
        request.setPackageCode("P2");
        request.setEditionCount(1);
        request.setHeadline("Merchant A Exclusive");
        request.setContactPhone("+919937011111");

        MvcResult createResult = mockMvc.perform(post("/api/advertising/advertisements")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        String adId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("id").asText();

        // Merchant B attempts to fetch ad of Merchant A -> 404
        mockMvc.perform(get("/api/advertising/advertisements/" + adId)
                        .header("Authorization", "Bearer " + merchantTokenB))
                .andExpect(status().isNotFound());

        // Merchant B attempts to update ad of Merchant A -> 404
        UpdateAdvertisementRequestDto updateRequest = new UpdateAdvertisementRequestDto();
        updateRequest.setHeadline("Hacked Headline");
        mockMvc.perform(patch("/api/advertising/advertisements/" + adId)
                        .header("Authorization", "Bearer " + merchantTokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should submit advertisement and transition lifecycle to SUBMITTED")
    void shouldSubmitAdvertisementDraft() throws Exception {
        CreateAdvertisementRequestDto request = new CreateAdvertisementRequestDto();
        request.setPackageCode("P3");
        request.setEditionCount(1);
        request.setHeadline("Diwali Festival Hardware Sale");
        request.setContactPhone("+919937011111");

        MvcResult createResult = mockMvc.perform(post("/api/advertising/advertisements")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        String adId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("id").asText();

        // Submit for review
        mockMvc.perform(post("/api/advertising/advertisements/" + adId + "/submit")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("SUBMITTED"))
                .andExpect(jsonPath("$.data.submittedAt").isNotEmpty());

        // Resubmitting when already SUBMITTED should fail
        mockMvc.perform(post("/api/advertising/advertisements/" + adId + "/submit")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should upload creative image file and record creative metadata")
    void shouldUploadCreativeImageFile() throws Exception {
        CreateAdvertisementRequestDto request = new CreateAdvertisementRequestDto();
        request.setPackageCode("P1");
        request.setEditionCount(1);
        request.setHeadline("Ad With Creative");
        request.setContactPhone("+919937011111");

        MvcResult createResult = mockMvc.perform(post("/api/advertising/advertisements")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        String adId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("id").asText();

        MockMultipartFile mockFile = new MockMultipartFile(
                "file",
                "sample-ad-artwork.png",
                "image/png",
                new byte[]{1, 2, 3, 4, 5, 6, 7, 8}
        );

        mockMvc.perform(multipart("/api/advertising/advertisements/" + adId + "/creative")
                        .file(mockFile)
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.hasCreative").value(true))
                .andExpect(jsonPath("$.data.creativeFilename").value("sample-ad-artwork.png"))
                .andExpect(jsonPath("$.data.creativeContentType").value("image/png"))
                .andExpect(jsonPath("$.data.creativeFileSize").value(8));
    }

    @Test
    @DisplayName("Should enforce Admin RBAC and execute editorial review state machine")
    void shouldEnforceAdminRbacAndEditorialLifecycle() throws Exception {
        // Create & Submit Ad by Merchant A
        CreateAdvertisementRequestDto request = new CreateAdvertisementRequestDto();
        request.setPackageCode("P5");
        request.setEditionCount(3);
        request.setHeadline("Mega Print Feature Advertisement");
        request.setContactPhone("+919937011111");

        MvcResult createResult = mockMvc.perform(post("/api/advertising/advertisements")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        String adId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("id").asText();

        mockMvc.perform(post("/api/advertising/advertisements/" + adId + "/submit")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isOk());

        // Non-admin merchant attempts to access admin review endpoint -> 403 Forbidden
        mockMvc.perform(get("/api/admin/advertisements")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isForbidden());

        // Admin can access review list
        mockMvc.perform(get("/api/admin/advertisements")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)));

        // Admin approves advertisement
        AdminReviewRequestDto approveDto = new AdminReviewRequestDto();
        approveDto.setAction("APPROVE");
        approveDto.setAdminNotes("Artwork meets print specifications.");

        mockMvc.perform(post("/api/admin/advertisements/" + adId + "/review")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(approveDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("APPROVED"))
                .andExpect(jsonPath("$.data.reviewedAt").isNotEmpty())
                .andExpect(jsonPath("$.data.adminNotes").value("Artwork meets print specifications."));

        // Admin confirms payment (payment status remains separate from ad status)
        AdminReviewRequestDto payDto = new AdminReviewRequestDto();
        payDto.setAction("CONFIRM_PAYMENT");
        payDto.setPaymentReference("UPI-BBSR-2026-9937");

        mockMvc.perform(post("/api/admin/advertisements/" + adId + "/review")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.paymentStatus").value("PAYMENT_CONFIRMED"))
                .andExpect(jsonPath("$.data.paymentReference").value("UPI-BBSR-2026-9937"))
                .andExpect(jsonPath("$.data.status").value("APPROVED")); // Still APPROVED!

        // Admin schedules approved ad
        AdminReviewRequestDto scheduleDto = new AdminReviewRequestDto();
        scheduleDto.setAction("SCHEDULE");

        mockMvc.perform(post("/api/admin/advertisements/" + adId + "/review")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(scheduleDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SCHEDULED"));

        // Admin publishes scheduled ad
        AdminReviewRequestDto publishDto = new AdminReviewRequestDto();
        publishDto.setAction("PUBLISH");

        mockMvc.perform(post("/api/admin/advertisements/" + adId + "/review")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(publishDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("PUBLISHED"));

        // Admin completes published ad
        AdminReviewRequestDto completeDto = new AdminReviewRequestDto();
        completeDto.setAction("COMPLETE");

        mockMvc.perform(post("/api/admin/advertisements/" + adId + "/review")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(completeDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));
    }

    @Test
    @DisplayName("Should handle rejection with mandatory reason and allow resubmission")
    void shouldHandleRejectionAndResubmission() throws Exception {
        CreateAdvertisementRequestDto request = new CreateAdvertisementRequestDto();
        request.setPackageCode("P2");
        request.setEditionCount(1);
        request.setHeadline("Needs Revision Headline");
        request.setContactPhone("+919937011111");

        MvcResult createResult = mockMvc.perform(post("/api/advertising/advertisements")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        String adId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("id").asText();

        mockMvc.perform(post("/api/advertising/advertisements/" + adId + "/submit")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isOk());

        // Rejection without reason fails
        AdminReviewRequestDto emptyRejectDto = new AdminReviewRequestDto();
        emptyRejectDto.setAction("REJECT");
        emptyRejectDto.setRejectionReason("");

        mockMvc.perform(post("/api/admin/advertisements/" + adId + "/review")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emptyRejectDto)))
                .andExpect(status().isBadRequest());

        // Rejection with reason succeeds
        AdminReviewRequestDto rejectDto = new AdminReviewRequestDto();
        rejectDto.setAction("REJECT");
        rejectDto.setRejectionReason("Contact number could not be verified. Please update.");

        mockMvc.perform(post("/api/admin/advertisements/" + adId + "/review")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rejectDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("REJECTED"))
                .andExpect(jsonPath("$.data.rejectionReason").value("Contact number could not be verified. Please update."));

        // Merchant fixes headline & contact phone
        UpdateAdvertisementRequestDto updateRequest = new UpdateAdvertisementRequestDto();
        updateRequest.setHeadline("Revised Correct Headline");
        updateRequest.setContactPhone("+919937098765");

        mockMvc.perform(patch("/api/advertising/advertisements/" + adId)
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.headline").value("Revised Correct Headline"));

        // Merchant resubmits
        mockMvc.perform(post("/api/advertising/advertisements/" + adId + "/submit")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SUBMITTED"))
                .andExpect(jsonPath("$.data.rejectionReason").doesNotExist());
    }

    @Test
    @DisplayName("Should retrieve merchant advertisement dashboard summary counts")
    void shouldRetrieveMerchantAdvertisementSummary() throws Exception {
        CreateAdvertisementRequestDto request = new CreateAdvertisementRequestDto();
        request.setPackageCode("P1");
        request.setEditionCount(1);
        request.setHeadline("Summary Test Ad");
        request.setContactPhone("+919937011111");

        mockMvc.perform(post("/api/advertising/advertisements")
                        .header("Authorization", "Bearer " + merchantTokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/advertising/advertisements/summary")
                        .header("Authorization", "Bearer " + merchantTokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").value(1))
                .andExpect(jsonPath("$.data.drafts").value(1))
                .andExpect(jsonPath("$.data.submitted").value(0))
                .andExpect(jsonPath("$.data.paymentPending").value(1));
    }
}

