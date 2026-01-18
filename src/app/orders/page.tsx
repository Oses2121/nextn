
'use client';

import { useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Order, OrderItem as OrderItemType } from '@/lib/types';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';

function OrderItem({ item }: { item: OrderItemType }) {
    const productImage = PlaceHolderImages.find(img => img.id === item.imageId);
    return (
        <div className="flex items-center gap-4 py-2">
            <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                {productImage && <Image src={productImage.imageUrl} alt={item.name} fill style={{objectFit: 'cover'}} data-ai-hint={productImage.imageHint} />}
            </div>
            <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
        </div>
    )
}


function OrderCard({ order }: { order: Order }) {
    const orderDate = order.createdAt?.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Card>
            <CardHeader className="flex-row justify-between items-start">
                <div>
                    <CardTitle>Order #{order.id.slice(0, 7).toUpperCase()}</CardTitle>
                    <CardDescription>Date: {orderDate}</CardDescription>
                </div>
                <Badge variant="outline">Processing</Badge>
            </CardHeader>
            <CardContent>
                <div className="divide-y">
                    {order.items.map((item, index) => (
                        <OrderItem key={`${order.id}-item-${index}`} item={item} />
                    ))}
                </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4 mt-4 flex justify-end font-bold text-lg rounded-b-lg">
                <span>Total: ${order.total.toFixed(2)}</span>
            </CardFooter>
        </Card>
    );
}

function OrdersSkeleton() {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex-row justify-between items-center">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-20" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
               <Skeleton className="h-6 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

export default function OrdersPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    const ordersQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, `users/${user.uid}/orders`), orderBy('createdAt', 'desc'));
    }, [user, firestore]);

    const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

    const isLoading = isUserLoading || areOrdersLoading;

    if (!isUserLoading && !user) {
        return null; // or a login prompt
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight mb-8">My Orders</h1>
            
            {isLoading && <OrdersSkeleton />}

            {!isLoading && orders && orders.length > 0 && (
                <div className="space-y-6">
                    {orders.map(order => <OrderCard key={order.id} order={order} />)}
                </div>
            )}

            {!isLoading && (!orders || orders.length === 0) && (
                 <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h2 className="text-2xl font-semibold">No Orders Yet</h2>
                    <p className="text-muted-foreground mt-2">
                        You haven't placed any orders. Let's change that!
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/products">Start Shopping</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
