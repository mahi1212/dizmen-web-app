export type UserRole = 'super_admin' | 'restaurant_authority' | 'customer';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type OnboardingStep = 'restaurant_info' | 'verification_documents' | 'complete';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  restaurantId?: string;
  onboardingDraft?: RestaurantDraft;
  onboardingCompleted: boolean;
}

export interface RestaurantDraft {
  step: number; // 1, 2, or 3
  formData: {
    name?: string;
    description?: string;
    address?: string;
    phone?: string;
    website?: string;
    googleLocationUrl?: string;
    socialMediaLinks?: SocialMediaLink[];
  };
  documents?: {
    name: string;
    size: number;
    type: string;
  }[];
  lastSaved: Date;
}

export interface VerificationDocument {
  id: string;
  documentType: 'business_license' | 'health_permit' | 'identity_proof' | 'other';
  documentUrl: string;
  uploadedAt: Date;
}

export interface SocialMediaLink {
  platform: string;
  url: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  ownerId: string;
  createdAt: Date;
  qrCode: string;
  verificationStatus: VerificationStatus;
  onboardingStep: OnboardingStep;
  verificationDocuments?: VerificationDocument[];
  verifiedAt?: Date;
  verifiedBy?: string; // Admin user ID
  rejectionReason?: string;
  socialMediaLinks?: SocialMediaLink[];
  googleLocationUrl?: string;
}

export interface Menu {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  icon?: string;
  order: number;
  isActive: boolean;
  timeRanges?: TimeRange[];
  createdAt: Date;
}

export interface TimeRange {
  startTime: string; // Format: "HH:mm"
  endTime: string;   // Format: "HH:mm"
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  menuId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  menuItemId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface MenuItemWithReviews extends MenuItem {
  reviews: Review[];
  averageRating: number;
}

