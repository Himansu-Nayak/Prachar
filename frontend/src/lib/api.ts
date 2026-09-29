import {
  ApiResponse,
  AuthResponse,
  CardStatus,
  CreateProfileInput,
  HealthResponse,
  MyProfile,
  ProfileStatus,
  PublicProfile,
  QRAnalytics,
  QRStatus,
  SlugAvailability,
  UpdateProfileInput,
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
  return request<PublicProfile>(`/api/profiles/public/${encodeURIComponent(slug)}`, {
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
