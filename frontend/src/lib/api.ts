import { ApiResponse, HealthResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function fetchHealth(): Promise<ApiResponse<HealthResponse>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return {
        success: false,
        error: {
          code: `HTTP_${res.status}`,
          message: `Backend returned status ${res.status}`,
        },
        timestamp: new Date().toISOString(),
      };
    }

    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: error instanceof Error ? error.message : "Failed to connect to backend",
      },
      timestamp: new Date().toISOString(),
    };
  }
}
