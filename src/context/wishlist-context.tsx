'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface WishlistContextType {
  wishlist: string[];
  isProductInWishlist: (productId: string) => boolean;
  toggleProductInWishlist: (productId: string, productName: string) => void;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);
  
  const wishlist = userProfile?.wishlist || [];

  const isProductInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const toggleProductInWishlist = async (productId: string, productName: string) => {
    if (!user || !userDocRef) {
      toast({
        variant: 'destructive',
        title: 'Please log in',
        description: 'You need to be logged in to manage your wishlist.',
      });
      router.push('/login');
      return;
    }
    
    const currentlyInWishlist = isProductInWishlist(productId);
    
    try {
      await updateDoc(userDocRef, {
        wishlist: currentlyInWishlist ? arrayRemove(productId) : arrayUnion(productId)
      });
      toast({
        title: currentlyInWishlist ? 'Removed from Wishlist' : 'Added to Wishlist',
        description: `${productName} has been ${currentlyInWishlist ? 'removed from' : 'added to'} your wishlist.`,
      });
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update your wishlist. Please try again.',
      });
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isProductInWishlist, toggleProductInWishlist, isLoading: isProfileLoading }}>
      {children}
    </WishlistContext.Provider>
  );
};
