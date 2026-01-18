'use client';

import { doc, Firestore, setDoc } from 'firebase/firestore';
import { User, updateProfile } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

/**
 * Creates or updates a user's profile in Firestore upon login or signup.
 * This is a non-blocking operation.
 * @param firestore - The Firestore instance.
 * @param user - The Firebase Auth user object.
 */
export const upsertUserProfile = (firestore: Firestore, user: User) => {
  const userDocRef = doc(firestore, 'users', user.uid);

  const profileData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };

  setDoc(userDocRef, profileData, { merge: true }).catch((_error) => {
    const contextualError = new FirestorePermissionError({
      path: userDocRef.path,
      operation: 'write',
      requestResourceData: profileData,
    });
    errorEmitter.emit('permission-error', contextualError);
  });
};

/**
 * Updates a user's profile in both Firebase Auth and Firestore.
 * This is a non-blocking operation.
 * @param user - The Firebase Auth user object.
 * @param firestore - The Firestore instance.
 * @param data - The data to update (e.g., { displayName: 'New Name' }).
 */
export const updateUserProfile = (
  user: User,
  firestore: Firestore,
  data: { displayName?: string; photoURL?: string }
) => {
  if (!user) return;

  // 1. Update Firebase Auth profile
  updateProfile(user, data).catch((error) => {
    // This is not a security rule error, a console error is acceptable here.
    console.error("Error updating Firebase Auth profile:", error);
  });

  // 2. Update Firestore document (handles security rule errors via the emitter)
  const userDocRef = doc(firestore, 'users', user.uid);
  updateDocumentNonBlocking(userDocRef, data);
};
