'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { doc } from 'firebase/firestore';
import { updateUserProfile } from '@/lib/user-actions';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
    }
  }, [userProfile]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && displayName !== (userProfile?.displayName || user.displayName)) {
      updateUserProfile(user, firestore, { displayName });
      toast({
        title: 'Profile Updated',
        description: 'Your display name has been successfully updated.',
      });
    }
  };
  
  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
             <div className='space-y-2'>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
             </div>
             <div className='space-y-2'>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
             </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={userProfile?.photoURL || user.photoURL || ''} alt={userProfile?.displayName || ''} />
                <AvatarFallback>{(userProfile?.displayName || user.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          <CardTitle className="text-3xl">{userProfile?.displayName || 'Welcome'}</CardTitle>
          <CardDescription>{userProfile?.email}</CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileUpdate}>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input 
                        id="displayName" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </div>
                 <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email || ''} disabled />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit">Save Changes</Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
