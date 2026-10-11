import {
  Advertisement,
  AdvertisementPackage,
  AdvertisementSummary,
  ApiResponse,
  CreateAdvertisementInput,
  EditionCutoff,
  UpdateAdvertisementInput,
} from "@/types";
import { apiClient } from "./client";
import { getApiUrl } from "@/lib/config/env";

export async function fetchAdvertisingPackages(): Promise<ApiResponse<AdvertisementPackage[]>> {
  return apiClient<AdvertisementPackage[]>("/api/advertising/packages", {
    method: "GET",
    next: { revalidate: 300 },
  });
}

export async function fetchAdvertisingCutoff(): Promise<ApiResponse<EditionCutoff>> {
  return apiClient<EditionCutoff>("/api/advertising/cutoff", {
    method: "GET",
    next: { revalidate: 60 },
  });
}

export async function fetchMyAdvertisements(token: string): Promise<ApiResponse<Advertisement[]>> {
  return apiClient<Advertisement[]>("/api/advertising/advertisements", {
    method: "GET",
    authToken: token,
  });
}

export async function fetchMyAdvertisementSummary(token: string): Promise<ApiResponse<AdvertisementSummary>> {
  return apiClient<AdvertisementSummary>("/api/advertising/advertisements/summary", {
    method: "GET",
    authToken: token,
  });
}

export async function fetchMyAdvertisementById(token: string, id: string): Promise<ApiResponse<Advertisement>> {
  return apiClient<Advertisement>(`/api/advertising/advertisements/${id}`, {
    method: "GET",
    authToken: token,
  });
}

export async function createAdvertisement(
  token: string,
  data: CreateAdvertisementInput
): Promise<ApiResponse<Advertisement>> {
  return apiClient<Advertisement>("/api/advertising/advertisements", {
    method: "POST",
    authToken: token,
    body: JSON.stringify(data),
  });
}

export async function updateAdvertisement(
  token: string,
  id: string,
  data: UpdateAdvertisementInput
): Promise<ApiResponse<Advertisement>> {
  return apiClient<Advertisement>(`/api/advertising/advertisements/${id}`, {
    method: "PATCH",
    authToken: token,
    body: JSON.stringify(data),
  });
}

export async function submitAdvertisement(token: string, id: string): Promise<ApiResponse<Advertisement>> {
  return apiClient<Advertisement>(`/api/advertising/advertisements/${id}/submit`, {
    method: "POST",
    authToken: token,
  });
}

export async function cancelAdvertisement(token: string, id: string): Promise<ApiResponse<Advertisement>> {
  return apiClient<Advertisement>(`/api/advertising/advertisements/${id}/cancel`, {
    method: "POST",
    authToken: token,
  });
}

export async function uploadAdvertisementCreative(
  token: string,
  id: string,
  file: File
): Promise<ApiResponse<Advertisement>> {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<Advertisement>(`/api/advertising/advertisements/${id}/creative`, {
    method: "POST",
    authToken: token,
    body: formData,
  });
}

export interface MerchantCreativeBlobResult {
  success: boolean;
  blob?: Blob;
  contentType?: string;
  filename?: string;
  error?: {
    code: string;
    message: string;
  };
}

export async function fetchMerchantCreativeBlob(
  token: string,
  adId: string
): Promise<MerchantCreativeBlobResult> {
  const url = getApiUrl(`/api/advertising/${adId}/creative`);
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
