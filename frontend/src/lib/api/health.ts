import { ApiResponse, HealthResponse } from "@/types";
import { apiClient } from "./client";

export async function fetchHealth(): Promise<ApiResponse<HealthResponse>> {
  return apiClient<HealthResponse>("/api/health", {
    method: "GET",
    next: { revalidate: 0 },
  });
}
