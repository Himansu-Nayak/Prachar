import {
  ApiResponse,
  CreatePaymentOrderResponse,
  PaymentTransaction,
  VerifyPaymentInput,
} from "@/types";
import { apiClient } from "./client";

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function createPaymentOrder(
  token: string,
  advertisementId: string
): Promise<ApiResponse<CreatePaymentOrderResponse>> {
  return apiClient<CreatePaymentOrderResponse>(
    `/api/advertising/advertisements/${advertisementId}/payment/order`,
    {
      method: "POST",
      authToken: token,
    }
  );
}

export async function verifyPayment(
  token: string,
  data: VerifyPaymentInput
): Promise<ApiResponse<PaymentTransaction>> {
  return apiClient<PaymentTransaction>("/api/advertising/payments/verify", {
    method: "POST",
    authToken: token,
    body: JSON.stringify(data),
  });
}

export async function fetchAdvertisementPayments(
  token: string,
  advertisementId: string
): Promise<ApiResponse<PaymentTransaction[]>> {
  return apiClient<PaymentTransaction[]>(
    `/api/advertising/advertisements/${advertisementId}/payments`,
    {
      method: "GET",
      authToken: token,
    }
  );
}
