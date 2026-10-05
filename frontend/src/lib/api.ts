import {
  AdminRefundInput,
  AdminReviewInput,
  Advertisement,
  AdvertisementPackage,
  AdvertisementSummary,
  ApiResponse,
  AuthResponse,
  CardStatus,
  CreateAdvertisementInput,
  CreatePaymentOrderResponse,
  CreateProfileInput,
  EditionCutoff,
  HealthResponse,
  MyProfile,
  OnboardingStatusData,
  OnboardingStatusType,
  PaymentTransaction,
  ProfileStatus,
  PublicProfile,
  PublicQrResolution,
  QRAnalytics,
  QRStatus,
  SlugAvailability,
  UpdateAdvertisementInput,
  UpdateProfileInput,
  UserAccount,
  VerifyPaymentInput,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${path}`;
  const defaultHeaders: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    return data as ApiResponse<T>;
  } catch (error) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: error instanceof Error ? error.message : "Network communication failure",
      },
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchHealth(): Promise<ApiResponse<HealthResponse>> {
  return request<HealthResponse>("/api/health", { method: "GET", next: { revalidate: 0 } });
}

// Authentication API
export async function requestOtp(phoneNumber: string): Promise<ApiResponse<{ message: string }>> {
  return request<{ message: string }>("/api/auth/otp/send", {
    method: "POST",
    body: JSON.stringify({ phoneNumber }),
  });
}

export async function verifyOtp(phoneNumber: string, otp: string): Promise<ApiResponse<AuthResponse>> {
  return request<AuthResponse>("/api/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ phoneNumber, otp }),
  });
}

export async function refreshAuthToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
  return request<AuthResponse>("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function logoutUser(token: string): Promise<ApiResponse<void>> {
  return request<void>("/api/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchSession(token: string): Promise<ApiResponse<Record<string, unknown>>> {
  return request<Record<string, unknown>>("/api/auth/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Profile API
export async function checkSlugAvailability(slug: string): Promise<ApiResponse<SlugAvailability>> {
  return request<SlugAvailability>(`/api/profiles/claim/${encodeURIComponent(slug)}`, {
    method: "GET",
  });
}

export async function fetchPublicProfile(slug: string): Promise<ApiResponse<PublicProfile>> {
  return request<PublicProfile>(`/api/public/profiles/${encodeURIComponent(slug)}`, {
    method: "GET",
    next: { revalidate: 10 },
  });
}

export async function fetchMyProfile(token: string): Promise<ApiResponse<MyProfile>> {
  return request<MyProfile>("/api/profiles/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createProfile(token: string, data: CreateProfileInput): Promise<ApiResponse<MyProfile>> {
  return request<MyProfile>("/api/profiles", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function updateProfile(token: string, data: UpdateProfileInput): Promise<ApiResponse<MyProfile>> {
  return request<MyProfile>("/api/profiles/me", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function updateProfileStatus(token: string, status: ProfileStatus): Promise<ApiResponse<MyProfile>> {
  return request<MyProfile>("/api/profiles/me/status", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
}

export async function updateCardStatus(token: string, status: CardStatus): Promise<ApiResponse<unknown>> {
  return request("/api/card/me/status", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
}

export async function updateQrStatus(token: string, status: QRStatus): Promise<ApiResponse<unknown>> {
  return request("/api/qr/me/status", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
}

export async function fetchQrAnalytics(token: string): Promise<ApiResponse<QRAnalytics>> {
  return request<QRAnalytics>("/api/qr/analytics", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Digital Card & QR API
export function getQrImageUrl(codeUuid: string, size = 300): string {
  return `${API_BASE_URL}/api/qr/image/${encodeURIComponent(codeUuid)}?size=${size}`;
}

export function getQrRedirectUrl(codeUuid: string): string {
  return `${API_BASE_URL}/qr/${encodeURIComponent(codeUuid)}`;
}

export async function fetchPublicQrResolution(codeUuid: string): Promise<ApiResponse<PublicQrResolution>> {
  return request<PublicQrResolution>(`/api/public/qr/${encodeURIComponent(codeUuid)}`, {
    method: "GET",
    next: { revalidate: 0 },
  });
}

// Phase 4: User Account Management
export async function fetchUserAccount(token: string): Promise<ApiResponse<UserAccount>> {
  return request<UserAccount>("/api/user/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateUserAccount(
  token: string,
  data: { email?: string }
): Promise<ApiResponse<UserAccount>> {
  return request<UserAccount>("/api/user/me", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

// Phase 4: Onboarding Status API
export async function fetchOnboardingStatus(
  token: string
): Promise<ApiResponse<OnboardingStatusData>> {
  return request<OnboardingStatusData>("/api/onboarding/status", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateOnboardingStep(
  token: string,
  status: OnboardingStatusType
): Promise<ApiResponse<OnboardingStatusData>> {
  return request<OnboardingStatusData>("/api/onboarding/step", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
}

// Phase 6: Advertising & Phygital Campaign API
export async function fetchAdvertisingPackages(): Promise<ApiResponse<AdvertisementPackage[]>> {
  return request<AdvertisementPackage[]>("/api/advertising/packages", {
    method: "GET",
    next: { revalidate: 300 },
  });
}

export async function fetchAdvertisingCutoff(): Promise<ApiResponse<EditionCutoff>> {
  return request<EditionCutoff>("/api/advertising/cutoff", {
    method: "GET",
    next: { revalidate: 60 },
  });
}

export async function fetchMyAdvertisements(token: string): Promise<ApiResponse<Advertisement[]>> {
  return request<Advertisement[]>("/api/advertising/advertisements", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchMyAdvertisementSummary(token: string): Promise<ApiResponse<AdvertisementSummary>> {
  return request<AdvertisementSummary>("/api/advertising/advertisements/summary", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchMyAdvertisementById(token: string, id: string): Promise<ApiResponse<Advertisement>> {
  return request<Advertisement>(`/api/advertising/advertisements/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createAdvertisement(
  token: string,
  data: CreateAdvertisementInput
): Promise<ApiResponse<Advertisement>> {
  return request<Advertisement>("/api/advertising/advertisements", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function updateAdvertisement(
  token: string,
  id: string,
  data: UpdateAdvertisementInput
): Promise<ApiResponse<Advertisement>> {
  return request<Advertisement>(`/api/advertising/advertisements/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function submitAdvertisement(token: string, id: string): Promise<ApiResponse<Advertisement>> {
  return request<Advertisement>(`/api/advertising/advertisements/${id}/submit`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function cancelAdvertisement(token: string, id: string): Promise<ApiResponse<Advertisement>> {
  return request<Advertisement>(`/api/advertising/advertisements/${id}/cancel`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function uploadAdvertisementCreative(
  token: string,
  id: string,
  file: File
): Promise<ApiResponse<Advertisement>> {
  const formData = new FormData();
  formData.append("file", file);
  const url = `${API_BASE_URL}/api/advertising/advertisements/${id}/creative`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });
    const data = await res.json();
    return data as ApiResponse<Advertisement>;
  } catch (error) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: error instanceof Error ? error.message : "Failed to upload creative file",
      },
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchAdminAdvertisements(
  token: string,
  status?: string
): Promise<ApiResponse<Advertisement[]>> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return request<Advertisement[]>(`/api/admin/advertisements${query}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchAdminAdvertisementSummary(
  token: string
): Promise<ApiResponse<AdvertisementSummary>> {
  return request<AdvertisementSummary>("/api/admin/advertisements/summary", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function reviewAdvertisement(
  token: string,
  id: string,
  data: AdminReviewInput
): Promise<ApiResponse<Advertisement>> {
  return request<Advertisement>(`/api/admin/advertisements/${id}/review`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

// ============================================================
// Phase 7: Payment Engine & Razorpay Integration API Calls
// ============================================================

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
  return request<CreatePaymentOrderResponse>(
    `/api/advertising/advertisements/${advertisementId}/payment/order`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function verifyPayment(
  token: string,
  data: VerifyPaymentInput
): Promise<ApiResponse<PaymentTransaction>> {
  return request<PaymentTransaction>("/api/advertising/payments/verify", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function fetchAdvertisementPayments(
  token: string,
  advertisementId: string
): Promise<ApiResponse<PaymentTransaction[]>> {
  return request<PaymentTransaction[]>(
    `/api/advertising/advertisements/${advertisementId}/payments`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function fetchAllPaymentsAdmin(
  token: string
): Promise<ApiResponse<PaymentTransaction[]>> {
  return request<PaymentTransaction[]>("/api/admin/payments", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function refundPaymentAdmin(
  token: string,
  transactionId: string,
  data: AdminRefundInput
): Promise<ApiResponse<PaymentTransaction>> {
  return request<PaymentTransaction>(`/api/admin/payments/${transactionId}/refund`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}


