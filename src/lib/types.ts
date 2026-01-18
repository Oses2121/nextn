
import type { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string; // Document ID from Firestore
  name: string;
  slug: string;
}

export interface Product {
  id: string; // Document ID from Firestore
  name: string;
  price: number;
  category: string; // This should be a category slug
  description: string;
  imageId: string;
  stock: number;
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
  id: string; // Product ID
  name: string;
  price: number;
  category: string;
  description: string;
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
