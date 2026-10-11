/**
 * PRACHAR Runtime Environment Configuration
 *
 * Centralizes, validates, and standardizes access to client-safe
 * and server-safe environment variables across the application.
 */

const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const RAW_APP_URL = process.env.NEXT_PUBLIC_APP_URL;
const RAW_APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
const RAW_RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

export const ENV = {
  API_BASE_URL: (RAW_API_BASE_URL || "http://localhost:8080").replace(/\/+$/, ""),
  APP_URL: (RAW_APP_URL || "http://localhost:3000").replace(/\/+$/, ""),
  APP_NAME: RAW_APP_NAME || "PRACHAR",
  RAZORPAY_KEY_ID: RAW_RAZORPAY_KEY || "rzp_test_placeholder_key",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
} as const;

/**
 * Constructs a fully qualified API URL safely avoiding duplicate slashes.
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${ENV.API_BASE_URL}${cleanPath}`;
}

/**
 * Validates critical environment configuration at runtime.
 */
export function validateRuntimeEnv(): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (ENV.IS_PRODUCTION) {
    if (!RAW_API_BASE_URL) {
      warnings.push("NEXT_PUBLIC_API_BASE_URL is not explicitly set; defaulting to localhost.");
    }
    if (!RAW_APP_URL) {
      warnings.push("NEXT_PUBLIC_APP_URL is not explicitly set; canonical URLs may be inaccurate.");
    }
    if (!RAW_RAZORPAY_KEY || RAW_RAZORPAY_KEY === "rzp_test_placeholder_key") {
      warnings.push("Production build is using placeholder Razorpay Key ID.");
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}
