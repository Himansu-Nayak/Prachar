import {
  ApiResponse,
  CreateProfileInput,
  MyProfile,
  ProfileStatus,
  PublicProfile,
  SlugAvailability,
  UpdateProfileInput,
} from "@/types";
import { apiClient } from "./client";

export async function checkSlugAvailability(slug: string): Promise<ApiResponse<SlugAvailability>> {
  return apiClient<SlugAvailability>(`/api/profiles/claim/${encodeURIComponent(slug)}`, {
    method: "GET",
  });
}

export async function fetchPublicProfile(slug: string): Promise<ApiResponse<PublicProfile>> {
  return apiClient<PublicProfile>(`/api/public/profiles/${encodeURIComponent(slug)}`, {
    method: "GET",
    next: { revalidate: 10 },
  });
}

export async function fetchMyProfile(token: string): Promise<ApiResponse<MyProfile>> {
  return apiClient<MyProfile>("/api/profiles/me", {
    method: "GET",
    authToken: token,
  });
}

export async function createProfile(token: string, data: CreateProfileInput): Promise<ApiResponse<MyProfile>> {
  return apiClient<MyProfile>("/api/profiles", {
    method: "POST",
    authToken: token,
    body: JSON.stringify(data),
  });
}

export async function updateProfile(token: string, data: UpdateProfileInput): Promise<ApiResponse<MyProfile>> {
  return apiClient<MyProfile>("/api/profiles/me", {
    method: "PUT",
    authToken: token,
    body: JSON.stringify(data),
  });
}

export async function updateProfileStatus(token: string, status: ProfileStatus): Promise<ApiResponse<MyProfile>> {
  return apiClient<MyProfile>("/api/profiles/me/status", {
    method: "PATCH",
    authToken: token,
    body: JSON.stringify({ status }),
  });
}
