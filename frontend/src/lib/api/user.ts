import { ApiResponse, OnboardingStatusData, OnboardingStatusType, UserAccount } from "@/types";
import { apiClient } from "./client";

export async function fetchUserAccount(token: string): Promise<ApiResponse<UserAccount>> {
  return apiClient<UserAccount>("/api/user/me", {
    method: "GET",
    authToken: token,
  });
}

export async function updateUserAccount(
  token: string,
  data: { email?: string }
): Promise<ApiResponse<UserAccount>> {
  return apiClient<UserAccount>("/api/user/me", {
    method: "PUT",
    authToken: token,
    body: JSON.stringify(data),
  });
}

export async function fetchOnboardingStatus(
  token: string
): Promise<ApiResponse<OnboardingStatusData>> {
  return apiClient<OnboardingStatusData>("/api/onboarding/status", {
    method: "GET",
    authToken: token,
  });
}

export async function updateOnboardingStep(
  token: string,
  status: OnboardingStatusType
): Promise<ApiResponse<OnboardingStatusData>> {
  return apiClient<OnboardingStatusData>("/api/onboarding/step", {
    method: "POST",
    authToken: token,
    body: JSON.stringify({ status }),
  });
}
