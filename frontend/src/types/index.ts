export type Role = 'ROLE_USER' | 'ROLE_ADVERTISER' | 'ROLE_STAFF' | 'ROLE_ADMIN';

export type ProfileStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type CardStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DECOMMISSIONED';

export type QRStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

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
  businessName?: string;
  category: string;
  tagline?: string;
  bio?: string;
  primaryPhone: string;
  whatsappNumber?: string;
  email?: string;
  websiteUrl?: string;
  addressText?: string;
  city: string;
  district?: string;
  state?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  themeColor: string;
  layoutType: string;
  qrCodeUuid?: string;
  qrTargetUrl?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialLinkedin?: string;
  status: string;
}

export interface MyProfile {
  profileId: string;
  usernameSlug: string;
  displayName: string;
  businessName?: string;
  category: string;
  tagline?: string;
  bio?: string;
  primaryPhone: string;
  whatsappNumber?: string;
  email?: string;
  websiteUrl?: string;
  addressText?: string;
  city: string;
  district?: string;
  state?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialLinkedin?: string;
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
  qrStatus?: string;
}

export interface CreateProfileInput {
  usernameSlug: string;
  displayName: string;
  businessName?: string;
  category: string;
  tagline?: string;
  bio?: string;
  primaryPhone: string;
  whatsappNumber?: string;
  email?: string;
  websiteUrl?: string;
  addressText?: string;
  city?: string;
  district?: string;
  state?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialLinkedin?: string;
  themeColor?: string;
}

export interface UpdateProfileInput {
  displayName?: string;
  businessName?: string;
  category?: string;
  tagline?: string;
  bio?: string;
  primaryPhone?: string;
  whatsappNumber?: string;
  email?: string;
  websiteUrl?: string;
  addressText?: string;
  city?: string;
  district?: string;
  state?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialLinkedin?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  isPublic?: boolean;
  themeColor?: string;
}

export interface QRScanEventSummary {
  scannedAt: string;
  deviceFamily: string;
  referrer?: string;
}

export interface QRAnalytics {
  totalScans: number;
  qrStatus: string;
  codeUuid: string;
  recentEvents: QRScanEventSummary[];
}

export interface HealthResponse {
  status: string;
  environment: string;
  service: string;
  timestamp: string;
}
