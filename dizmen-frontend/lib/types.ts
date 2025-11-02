export type UserRole = 'super_admin' | 'restaurant_authority' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  restaurantId?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  ownerId: string;
  createdAt: Date;
  qrCode: string;
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

