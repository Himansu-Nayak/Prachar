package com.prachar.payment;

import com.prachar.common.ApiResponse;
import com.prachar.payment.dto.CreatePaymentOrderResponseDto;
import com.prachar.payment.dto.PaymentTransactionResponseDto;
import com.prachar.payment.dto.VerifyPaymentRequestDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/advertising")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/advertisements/{id}/payment/order")
    public ResponseEntity<ApiResponse<CreatePaymentOrderResponseDto>> createPaymentOrder(
            @AuthenticationPrincipal UUID userId,
            @PathVariable("id") UUID advertisementId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to create payment order.");
        }
        CreatePaymentOrderResponseDto response = paymentService.createPaymentOrderWithIdempotency(userId, advertisementId, idempotencyKey);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Razorpay payment order initialized successfully."));
    }

    @PostMapping("/payments/verify")
    public ResponseEntity<ApiResponse<PaymentTransactionResponseDto>> verifyPayment(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody VerifyPaymentRequestDto request) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to verify payment.");
        }
        PaymentTransactionResponseDto response = paymentService.verifyPayment(userId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Payment verified and confirmed successfully."));
    }

    @GetMapping("/advertisements/{id}/payments")
    public ResponseEntity<ApiResponse<List<PaymentTransactionResponseDto>>> getAdvertisementPayments(
            @AuthenticationPrincipal UUID userId,
            @PathVariable("id") UUID advertisementId) {
        if (userId == null) {
            throw new IllegalArgumentException("Authentication required to view payment transactions.");
        }
        List<PaymentTransactionResponseDto> response = paymentService.getTransactionsForAdvertisement(userId, advertisementId);
        return ResponseEntity.ok(ApiResponse.success(response, "Payment transactions retrieved."));
    }
}
