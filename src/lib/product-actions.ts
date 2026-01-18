'use client';

import { collection, addDoc, updateDoc, deleteDoc, doc, Firestore } from "firebase/firestore";
import type { Product } from "./types";

// The form data will have price/stock as numbers due to `z.coerce.number()` in the form schema
export type ProductFormData = Omit<Product, 'id'>;

/**
 * Saves a product (creates or updates) to Firestore.
 * @param firestore - The Firestore instance.
 * @param productData - The product data from the form.
 * @param productId - The ID of the product to update. If null/undefined, a new product is created.
 */
export async function saveProduct(firestore: Firestore, productData: ProductFormData, productId?: string) {
    if (productId) {
        // Update existing product
        const productRef = doc(firestore, 'products', productId);
        await updateDoc(productRef, productData);
    } else {
        // Add new product
        await addDoc(collection(firestore, 'products'), productData);
    }
}

/**
 * Deletes a product from Firestore.
 * @param firestore - The Firestore instance.
 * @param productId - The ID of the product to delete.
 */
export async function deleteProduct(firestore: Firestore, productId: string) {
    const productRef = doc(firestore, 'products', productId);
    await deleteDoc(productRef);
}
