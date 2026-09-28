export type Role = 'ROLE_USER' | 'ROLE_ADVERTISER' | 'ROLE_STAFF' | 'ROLE_ADMIN';

export type ProfileStatus = 'DRAFT' | 'ACTIVE' | 'SUSPENDED';

export type CardStatus = 'ACTIVE' | 'SUSPENDED' | 'DECOMMISSIONED';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      rejectedValue: unknown;
      message: string;
    }>;
  };
  timestamp: string;
}

export interface UserSummary {
  id: string;
  phoneNumber: string;
  email?: string;
  role: Role;
  active: boolean;
}

export interface ProfileSummary {
  id: string;
  usernameSlug: string;
  displayName: string;
  category: string;
  tagline?: string;
  bio?: string;
  primaryPhone: string;
  whatsappNumber?: string;
  email?: string;
  websiteUrl?: string;
  addressText?: string;
  city: string;
  avatarUrl?: string;
  bannerUrl?: string;
  status: ProfileStatus;
}

export interface HealthResponse {
  status: string;
  environment: string;
  service: string;
  timestamp: string;
}
