import {
  AdminRefundInput,
  AdminReviewInput,
  Advertisement,
  AdvertisementSummary,
  ApiResponse,
  PaymentTransaction,
} from "@/types";
import { apiClient } from "./client";
import { getApiUrl } from "@/lib/config/env";

export async function fetchAdminAdvertisements(
  token: string,
  status?: string
): Promise<ApiResponse<Advertisement[]>> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiClient<Advertisement[]>(`/api/admin/advertisements${query}`, {
    method: "GET",
    authToken: token,
  });
}

export async function fetchAdminAdvertisementSummary(
  token: string
): Promise<ApiResponse<AdvertisementSummary>> {
  return apiClient<AdvertisementSummary>("/api/admin/advertisements/summary", {
    method: "GET",
    authToken: token,
  });
}

export async function reviewAdvertisement(
  token: string,
  id: string,
  data: AdminReviewInput
): Promise<ApiResponse<Advertisement>> {
  return apiClient<Advertisement>(`/api/admin/advertisements/${id}/review`, {
    method: "POST",
    authToken: token,
    body: JSON.stringify(data),
  });
}

export async function fetchAllPaymentsAdmin(
  token: string
): Promise<ApiResponse<PaymentTransaction[]>> {
  return apiClient<PaymentTransaction[]>("/api/admin/payments", {
    method: "GET",
    authToken: token,
  });
}

export async function refundPaymentAdmin(
  token: string,
  transactionId: string,
  data: AdminRefundInput
): Promise<ApiResponse<PaymentTransaction>> {
  return apiClient<PaymentTransaction>(`/api/admin/payments/${transactionId}/refund`, {
    method: "POST",
    authToken: token,
    body: JSON.stringify(data),
  });
}

export interface AdminCreativeBlobResult {
  success: boolean;
  blob?: Blob;
  contentType?: string;
  filename?: string;
  error?: {
    code: string;
    message: string;
  };
}

export async function fetchAdminCreativeBlob(
  token: string,
  adId: string
): Promise<AdminCreativeBlobResult> {
  const url = getApiUrl(`/api/admin/advertisements/${adId}/creative`);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      try {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.error || {
            code: `HTTP_${res.status}`,
            message: `Server returned error ${res.status}: ${res.statusText}`,
          },
        };
      } catch {
        return {
          success: false,
          error: {
            code: `HTTP_${res.status}`,
            message: `Failed to retrieve creative: HTTP ${res.status} ${res.statusText}`,
          },
        };
      }
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const disposition = res.headers.get("content-disposition") || "";
    let filename = `creative-${adId}`;
    const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1].replace(/['"]/g, "").trim();
    }

    const blob = await res.blob();
    return {
      success: true,
      blob,
      contentType,
      filename,
    };
  } catch (err) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: err instanceof Error ? err.message : "Network failure while fetching creative",
      },
    };
  }
}
