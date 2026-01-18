'use client';

import { Product, ProductVariant } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string; // Composite ID: e.g., `productId_variantName`
  productId: string;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
  imageId: string;
  category: string;
}


interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, selectedVariant: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  cartCount: number;
  totalPrice: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);


  const addToCart = (product: Product, selectedVariant: ProductVariant, quantity: number = 1) => {
    const cartItemId = `${product.id}_${selectedVariant.name}`;
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === cartItemId);
      if (existingItem) {
        // Increase quantity of existing item
        return prevItems.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        const newItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            name: product.name,
            variantName: selectedVariant.name,
            price: selectedVariant.price,
            quantity,
            imageId: product.imageId,
            category: product.category,
        };
        return [...prevItems, newItem];
      }
    });
    toast({
        title: "Added to cart",
        description: `${product.name} (${selectedVariant.name}) has been added to your cart.`,
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
        removeFromCart(cartItemId);
        return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
      setCartItems([]);
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        totalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
