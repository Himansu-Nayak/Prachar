package com.prachar.payment;

import com.prachar.common.ApiResponse;
import com.prachar.payment.dto.AdminRefundRequestDto;
import com.prachar.payment.dto.PaymentTransactionResponseDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/payments")
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class AdminPaymentController {

    private final PaymentService paymentService;

    public AdminPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentTransactionResponseDto>>> getAllTransactions() {
        List<PaymentTransactionResponseDto> list = paymentService.getAllTransactionsForAdmin();
        return ResponseEntity.ok(ApiResponse.success(list, "Payment transactions retrieved for administrative audit."));
    }

    @PostMapping("/{transactionId}/refund")
    public ResponseEntity<ApiResponse<PaymentTransactionResponseDto>> refundTransaction(
            @AuthenticationPrincipal UUID adminUserId,
            @PathVariable UUID transactionId,
            @Valid @RequestBody AdminRefundRequestDto request) {
        PaymentTransactionResponseDto response = paymentService.processRefund(adminUserId, transactionId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Refund processed successfully."));
    }
}
