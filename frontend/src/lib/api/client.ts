import { ApiResponse } from "@/types";
import { getApiUrl } from "@/lib/config/env";

export interface ApiClientOptions extends RequestInit {
  timeoutMs?: number;
  authToken?: string | null;
}

const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Robust, unified HTTP request client for PRACHAR.
 * Handles timeouts, network partitions, non-JSON gateway responses,
 * 204 No Content responses, and consistent error normalization.
 */
export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    authToken,
    headers: customHeaders,
    ...fetchOptions
  } = options;

  const url = getApiUrl(path);

  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
  };

  // Only attach Content-Type: application/json if body is not FormData
  if (!(fetchOptions.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  if (authToken) {
    defaultHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const mergedHeaders = {
    ...defaultHeaders,
    ...(customHeaders as Record<string, string> | undefined),
  };

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers: mergedHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 204 No Content responses cleanly
    if (res.status === 204) {
      return {
        success: true,
        data: undefined as unknown as T,
        timestamp: new Date().toISOString(),
      };
    }

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (isJson) {
      const data = await res.json();
      return data as ApiResponse<T>;
    }

    // Server returned HTML or raw text (e.g., 502/504 gateway error)
    const textBody = await res.text();
    const cleanSnippet = textBody
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 150);

    return {
      success: false,
      error: {
        code: `HTTP_${res.status}`,
        message: cleanSnippet || `HTTP Error ${res.status}: ${res.statusText}`,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        success: false,
        error: {
          code: "TIMEOUT_ERROR",
          message: `Request timed out after ${Math.round(timeoutMs / 1000)} seconds`,
        },
        timestamp: new Date().toISOString(),
      };
    }

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
