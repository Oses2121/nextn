
import type { Timestamp } from 'firebase/firestore';

// Represents a product item within an order
export interface OrderItem {
  id: number;
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
