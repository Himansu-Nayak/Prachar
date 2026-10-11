import { ApiResponse, AuthResponse } from "@/types";
import { apiClient } from "./client";

export async function requestOtp(phoneNumber: string): Promise<ApiResponse<{ message: string }>> {
  return apiClient<{ message: string }>("/api/auth/otp/send", {
    method: "POST",
    body: JSON.stringify({ phoneNumber }),
  });
}

export async function verifyOtp(phoneNumber: string, otp: string): Promise<ApiResponse<AuthResponse>> {
  return apiClient<AuthResponse>("/api/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ phoneNumber, otp }),
  });
}

export async function refreshAuthToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
  return apiClient<AuthResponse>("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function logoutUser(token: string): Promise<ApiResponse<void>> {
  return apiClient<void>("/api/auth/logout", {
    method: "POST",
    authToken: token,
  });
}

export async function fetchSession(token: string): Promise<ApiResponse<Record<string, unknown>>> {
  return apiClient<Record<string, unknown>>("/api/auth/me", {
    method: "GET",
    authToken: token,
  });
}
