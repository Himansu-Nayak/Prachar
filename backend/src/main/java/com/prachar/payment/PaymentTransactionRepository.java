package com.prachar.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, UUID> {

    Optional<PaymentTransaction> findByGatewayOrderId(String gatewayOrderId);

    Optional<PaymentTransaction> findByGatewayPaymentId(String gatewayPaymentId);

    List<PaymentTransaction> findByAdvertisementIdOrderByCreatedAtDesc(UUID advertisementId);

    List<PaymentTransaction> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<PaymentTransaction> findByIdAndUserId(UUID id, UUID userId);

    List<PaymentTransaction> findAllByOrderByCreatedAtDesc();
}
