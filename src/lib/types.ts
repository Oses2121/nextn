
import type { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string; // Document ID from Firestore
  name: string;
  slug: string;
}

export interface ProductVariant {
  name: string; // e.g., "Small", "Red", "Large"
  price: number;
  stock: number;
}

export interface Product {
  id: string; // Document ID from Firestore
  name: string;
  basePrice: number; // The default price to show on cards/listings
  category: string; // This should be a category slug
  description: string;
  imageId: string;
  variants: ProductVariant[];
}

export interface ProductReview {
  id: string; // Document ID from Firestore
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

// Represents a product item within an order (a snapshot of the product at purchase time)
export interface OrderItem {
  productId: string;
  name: string;
  variantName: string;
  price: number;
  category: string;
  imageId: string;
  quantity: number;
}

// Represents a completed order
export interface Order {
  id: string; // Document ID from Firestore
  userId: string;
  createdAt: Timestamp;
  total: number;
  items: OrderItem[];
  shippingInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zip: string;
  };
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  wishlist?: string[];
}
