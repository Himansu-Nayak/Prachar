package com.prachar.advertising;

import com.prachar.advertising.dto.AdminReviewRequestDto;
import com.prachar.advertising.dto.AdvertisementResponseDto;
import com.prachar.advertising.dto.AdvertisementSummaryDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminAdvertisementService {

    private final AdvertisementRepository advertisementRepository;
    private final AdvertisementService advertisementService;

    public AdminAdvertisementService(AdvertisementRepository advertisementRepository,
                                     AdvertisementService advertisementService) {
        this.advertisementRepository = advertisementRepository;
        this.advertisementService = advertisementService;
    }

    @Transactional(readOnly = true)
    public List<AdvertisementResponseDto> getAllAdvertisements(String statusFilter) {
        List<Advertisement> list;
        if (statusFilter != null && !statusFilter.isBlank()) {
            try {
                AdvertisementStatus status = AdvertisementStatus.valueOf(statusFilter.trim().toUpperCase());
                list = advertisementRepository.findByStatusOrderByCreatedAtDesc(status);
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("Invalid advertisement status filter: " + statusFilter);
            }
        } else {
            list = advertisementRepository.findAllByOrderByCreatedAtDesc();
        }

        return list.stream()
                .map(advertisementService::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdvertisementResponseDto getAdvertisementById(UUID adId) {
        Advertisement ad = advertisementRepository.findById(adId)
                .orElseThrow(() -> new EntityNotFoundException("Advertisement with ID " + adId + " was not found."));
        return advertisementService.mapToDto(ad);
    }

    @Transactional
    public AdvertisementResponseDto reviewAdvertisement(UUID adId, AdminReviewRequestDto reviewDto) {
        Advertisement ad = advertisementRepository.findById(adId)
                .orElseThrow(() -> new EntityNotFoundException("Advertisement with ID " + adId + " was not found."));

        String action = reviewDto.getAction().trim().toUpperCase();

        switch (action) {
            case "APPROVE" -> {
                if (ad.getStatus() != AdvertisementStatus.SUBMITTED &&
                        ad.getStatus() != AdvertisementStatus.UNDER_REVIEW) {
                    throw new IllegalStateException("Only advertisements in SUBMITTED or UNDER_REVIEW status can be approved. Current status: " + ad.getStatus());
                }
                ad.setStatus(AdvertisementStatus.APPROVED);
                ad.setReviewedAt(Instant.now());
                ad.setRejectionReason(null);
                if (reviewDto.getAdminNotes() != null) {
                    ad.setAdminNotes(reviewDto.getAdminNotes().trim());
                }
            }
            case "REJECT" -> {
                if (ad.getStatus() != AdvertisementStatus.SUBMITTED &&
                        ad.getStatus() != AdvertisementStatus.UNDER_REVIEW &&
                        ad.getStatus() != AdvertisementStatus.APPROVED) {
                    throw new IllegalStateException("Cannot reject advertisement in current status: " + ad.getStatus());
                }
                if (reviewDto.getRejectionReason() == null || reviewDto.getRejectionReason().isBlank()) {
                    throw new IllegalArgumentException("A rejection reason is required when rejecting an advertisement.");
                }
                ad.setStatus(AdvertisementStatus.REJECTED);
                ad.setRejectionReason(reviewDto.getRejectionReason().trim());
                ad.setReviewedAt(Instant.now());
                if (reviewDto.getAdminNotes() != null) {
                    ad.setAdminNotes(reviewDto.getAdminNotes().trim());
                }
            }
            case "SCHEDULE" -> {
                if (ad.getStatus() != AdvertisementStatus.APPROVED) {
                    throw new IllegalStateException("Only APPROVED advertisements can be scheduled for publication. Current status: " + ad.getStatus());
                }
                if (ad.getPaymentStatus() != PaymentStatus.PAYMENT_CONFIRMED) {
                    throw new IllegalStateException("Advertisement cannot be scheduled without confirmed payment. Current payment status: " + ad.getPaymentStatus());
                }
                ad.setStatus(AdvertisementStatus.SCHEDULED);
                ad.setScheduledAt(Instant.now());
                if (reviewDto.getAdminNotes() != null) {
                    ad.setAdminNotes(reviewDto.getAdminNotes().trim());
                }
            }
            case "PUBLISH" -> {
                if (ad.getStatus() != AdvertisementStatus.SCHEDULED) {
                    throw new IllegalStateException("Only SCHEDULED advertisements can be marked as PUBLISHED. Current status: " + ad.getStatus());
                }
                ad.setStatus(AdvertisementStatus.PUBLISHED);
                ad.setPublishedAt(Instant.now());
                if (reviewDto.getAdminNotes() != null) {
                    ad.setAdminNotes(reviewDto.getAdminNotes().trim());
                }
            }
            case "COMPLETE" -> {
                if (ad.getStatus() != AdvertisementStatus.PUBLISHED) {
                    throw new IllegalStateException("Only PUBLISHED advertisements can be completed. Current status: " + ad.getStatus());
                }
                ad.setStatus(AdvertisementStatus.COMPLETED);
                if (reviewDto.getAdminNotes() != null) {
                    ad.setAdminNotes(reviewDto.getAdminNotes().trim());
                }
            }
            case "MARK_UNDER_REVIEW" -> {
                if (ad.getStatus() != AdvertisementStatus.SUBMITTED) {
                    throw new IllegalStateException("Only SUBMITTED advertisements can be moved to UNDER_REVIEW. Current status: " + ad.getStatus());
                }
                ad.setStatus(AdvertisementStatus.UNDER_REVIEW);
                if (reviewDto.getAdminNotes() != null) {
                    ad.setAdminNotes(reviewDto.getAdminNotes().trim());
                }
            }
            case "CONFIRM_PAYMENT" -> {
                ad.setPaymentStatus(PaymentStatus.PAYMENT_CONFIRMED);
                ad.setPaidAt(Instant.now());
                if (reviewDto.getPaymentReference() != null && !reviewDto.getPaymentReference().isBlank()) {
                    ad.setPaymentReference(reviewDto.getPaymentReference().trim());
                }
                if (reviewDto.getAdminNotes() != null) {
                    ad.setAdminNotes(reviewDto.getAdminNotes().trim());
                }
            }
            case "REFUND" -> {
                if (ad.getPaymentStatus() != PaymentStatus.PAYMENT_CONFIRMED) {
                    throw new IllegalStateException("Only advertisements with confirmed payment can be refunded.");
                }
                ad.setPaymentStatus(PaymentStatus.PAYMENT_REFUNDED);
                if (reviewDto.getAdminNotes() != null) {
                    ad.setAdminNotes(reviewDto.getAdminNotes().trim());
                }
            }
            default -> throw new IllegalArgumentException("Unknown or unsupported review action: " + reviewDto.getAction());
        }

        Advertisement saved = advertisementRepository.save(ad);
        return advertisementService.mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public AdvertisementSummaryDto getAdminSummary() {
        long total = advertisementRepository.count();
        long drafts = advertisementRepository.countByStatus(AdvertisementStatus.DRAFT);
        long submitted = advertisementRepository.countByStatus(AdvertisementStatus.SUBMITTED);
        long underReview = advertisementRepository.countByStatus(AdvertisementStatus.UNDER_REVIEW);
        long approved = advertisementRepository.countByStatus(AdvertisementStatus.APPROVED);
        long scheduled = advertisementRepository.countByStatus(AdvertisementStatus.SCHEDULED);
        long published = advertisementRepository.countByStatus(AdvertisementStatus.PUBLISHED);
        long completed = advertisementRepository.countByStatus(AdvertisementStatus.COMPLETED);
        long rejected = advertisementRepository.countByStatus(AdvertisementStatus.REJECTED);
        long paymentPending = advertisementRepository.findAll().stream()
                .filter(ad -> ad.getPaymentStatus() == PaymentStatus.PAYMENT_PENDING)
                .count();

        return new AdvertisementSummaryDto(total, drafts, submitted, underReview, approved, scheduled, published, completed, rejected, paymentPending);
    }
}
