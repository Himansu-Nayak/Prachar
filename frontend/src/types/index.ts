export type Role = 'ROLE_USER' | 'ROLE_ADVERTISER' | 'ROLE_STAFF' | 'ROLE_ADMIN';

export type AccountStatusType = 'ACTIVE' | 'DISABLED' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export type OnboardingStatusType =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'PROFILE_CREATED'
  | 'CARD_CREATED'
  | 'QR_CREATED'
  | 'COMPLETED';

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
  onboardingStatus?: OnboardingStatusType;
  accountStatus?: AccountStatusType;
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

export interface PublicQrResolution {
  codeUuid: string;
  targetUrl: string;
  usernameSlug?: string;
  displayName?: string;
  qrStatus: string;
  profileStatus: string;
}

export interface HealthResponse {
  status: string;
  environment: string;
  service: string;
  timestamp: string;
}

// Phase 4: User Account Management
export interface UserAccount {
  id: string;
  phoneNumber: string;
  email?: string;
  role: Role;
  accountStatus: AccountStatusType;
  onboardingStatus: OnboardingStatusType;
  hasProfile: boolean;
  usernameSlug?: string;
  displayName?: string;
  createdAt: string;
  updatedAt: string;
}

// Phase 4: Onboarding Wizard
export interface OnboardingStepDetail {
  step: number;
  key: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface OnboardingStatusData {
  userId: string;
  phoneNumber: string;
  onboardingStatus: OnboardingStatusType;
  accountStatus: AccountStatusType;
  currentStep: number;
  completed: boolean;
  hasProfile: boolean;
  usernameSlug?: string;
  displayName?: string;
  steps: OnboardingStepDetail[];
}

// Phase 6: Advertising & Phygital Campaign Engine
export type AdvertisementStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PAYMENT_PENDING'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_REFUNDED';

export interface AdvertisementPackage {
  id: string;
  packageCode: string;
  name: string;
  formatDescription: string;
  colorType: string;
  singleEditionPrice: number;
  threeEditionPrice: number;
  savingsAmount: number;
  active: boolean;
}

export interface EditionCutoff {
  currentTargetEdition: string;
  cutoffDate: string;
  cutoffPassed: boolean;
  nextAvailableEdition: string;
  message: string;
  threeEditionSchedule: string[];
}

export interface Advertisement {
  id: string;
  userId: string;
  profileId?: string;
  usernameSlug?: string;
  packageCode: string;
  packageName: string;
  formatDescription?: string;
  editionCount: number;
  amount: number;
  currency: string;
  targetEdition: string;
  cutoffPassed: boolean;
  headline: string;
  adText?: string;
  businessName?: string;
  category?: string;
  contactPhone: string;
  contactEmail?: string;
  city: string;
  status: AdvertisementStatus;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  rejectionReason?: string;
  adminNotes?: string;
  creativeFilename?: string;
  creativeContentType?: string;
  creativeFileSize?: number;
  hasCreative: boolean;
  submittedAt?: string;
  reviewedAt?: string;
  paidAt?: string;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdvertisementSummary {
  total: number;
  drafts: number;
  submitted: number;
  underReview: number;
  approved: number;
  scheduled: number;
  published: number;
  completed: number;
  rejected: number;
  paymentPending: number;
}

export interface CreateAdvertisementInput {
  packageCode: string;
  editionCount?: number;
  profileId?: string;
  headline: string;
  adText?: string;
  businessName?: string;
  category?: string;
  contactPhone: string;
  contactEmail?: string;
  city?: string;
}

export interface UpdateAdvertisementInput {
  packageCode?: string;
  editionCount?: number;
  profileId?: string;
  headline?: string;
  adText?: string;
  businessName?: string;
  category?: string;
  contactPhone?: string;
  contactEmail?: string;
  city?: string;
}

export interface AdminReviewInput {
  action: 'APPROVE' | 'REJECT' | 'SCHEDULE' | 'PUBLISH' | 'COMPLETE' | 'MARK_UNDER_REVIEW' | 'CONFIRM_PAYMENT' | 'REFUND';
  rejectionReason?: string;
  adminNotes?: string;
  paymentReference?: string;
}

export type PaymentGatewayType = 'RAZORPAY' | 'OFFLINE_CASH';

export type PaymentTransactionStatus =
  | 'CREATED'
  | 'ORDER_CREATED'
  | 'PAYMENT_ATTEMPTED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'REFUND_FAILED';

export interface CreatePaymentOrderResponse {
  transactionId: string;
  advertisementId: string;
  gateway: string;
  razorpayOrderId: string;
  amountMinor: number;
  amount: number;
  currency: string;
  razorpayKeyId: string;
  headline?: string;
  packageCode?: string;
  businessName?: string;
}

export interface VerifyPaymentInput {
  advertisementId: string;
  transactionId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PaymentTransaction {
  id: string;
  advertisementId: string;
  gateway: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  amountMinor: number;
  amount: number;
  currency: string;
  status: PaymentTransactionStatus;
  failureReason?: string;
  confirmedAt?: string;
  createdAt: string;
  refundedAmountMinor?: number;
  refundReason?: string;
  refundId?: string;
}

export interface AdminRefundInput {
  reason: string;
  amountMinor?: number;
}


