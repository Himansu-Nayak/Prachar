import {
  ApiResponse,
  CardStatus,
  PublicQrResolution,
  QRAnalytics,
  QRStatus,
} from "@/types";
import { apiClient } from "./client";
import { ENV } from "@/lib/config/env";

export async function updateCardStatus(token: string, status: CardStatus): Promise<ApiResponse<unknown>> {
  return apiClient("/api/card/me/status", {
    method: "PATCH",
    authToken: token,
    body: JSON.stringify({ status }),
  });
}

export async function updateQrStatus(token: string, status: QRStatus): Promise<ApiResponse<unknown>> {
  return apiClient("/api/qr/me/status", {
    method: "PATCH",
    authToken: token,
    body: JSON.stringify({ status }),
  });
}

export async function fetchQrAnalytics(token: string): Promise<ApiResponse<QRAnalytics>> {
  return apiClient<QRAnalytics>("/api/qr/analytics", {
    method: "GET",
    authToken: token,
  });
}

export function getQrImageUrl(codeUuid: string, size = 300): string {
  return `${ENV.API_BASE_URL}/api/qr/image/${encodeURIComponent(codeUuid)}?size=${size}`;
}

export function getQrRedirectUrl(codeUuid: string): string {
  return `${ENV.API_BASE_URL}/qr/${encodeURIComponent(codeUuid)}`;
}

export async function fetchPublicQrResolution(codeUuid: string): Promise<ApiResponse<PublicQrResolution>> {
  return apiClient<PublicQrResolution>(`/api/public/qr/${encodeURIComponent(codeUuid)}`, {
    method: "GET",
    next: { revalidate: 0 },
  });
}
