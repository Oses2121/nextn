'use client';

import { collection, addDoc, updateDoc, deleteDoc, doc, Firestore } from "firebase/firestore";
import type { Category } from "./types";

export type CategoryFormData = Omit<Category, 'id'>;

/**
 * Saves a category (creates or updates) to Firestore.
 * @param firestore - The Firestore instance.
 * @param categoryData - The category data from the form.
 * @param categoryId - The ID of the category to update. If null/undefined, a new category is created.
 */
export async function saveCategory(firestore: Firestore, categoryData: CategoryFormData, categoryId?: string) {
    if (categoryId) {
        // Update existing category
        const categoryRef = doc(firestore, 'categories', categoryId);
        await updateDoc(categoryRef, categoryData);
    } else {
        // Add new category
        await addDoc(collection(firestore, 'categories'), categoryData);
    }
}

/**
 * Deletes a category from Firestore.
 * @param firestore - The Firestore instance.
 * @param categoryId - The ID of the category to delete.
 */
export async function deleteCategory(firestore: Firestore, categoryId: string) {
    const categoryRef = doc(firestore, 'categories', categoryId);
    await deleteDoc(categoryRef);
}
