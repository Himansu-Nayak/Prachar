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

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  userId: string;
  phoneNumber: string;
  role: string;
  hasProfile: boolean;
  usernameSlug?: string;
}

export interface SlugAvailability {
  slug: string;
  available: boolean;
  message: string;
}

export interface PublicProfile {
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
  themeColor: string;
  layoutType: string;
  qrCodeUuid?: string;
  qrTargetUrl?: string;
}

export interface MyProfile {
  profileId: string;
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
  isPublic: boolean;
  createdAt: string;

  // Digital Card
  cardId?: string;
  themeColor?: string;
  layoutType?: string;
  isNfcEnabled?: boolean;
  cardStatus?: CardStatus;

  // QR Code
  qrId?: string;
  codeUuid?: string;
  targetUrl?: string;
  scanCount?: number;
}

export interface CreateProfileInput {
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
  city?: string;
  themeColor?: string;
}

export interface UpdateProfileInput {
  displayName?: string;
  category?: string;
  tagline?: string;
  bio?: string;
  primaryPhone?: string;
  whatsappNumber?: string;
  email?: string;
  websiteUrl?: string;
  addressText?: string;
  city?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  isPublic?: boolean;
  themeColor?: string;
}

export interface HealthResponse {
  status: string;
  environment: string;
  service: string;
  timestamp: string;
}
