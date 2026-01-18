'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/wishlist-context';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart } from 'lucide-react';

function WishlistSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/4" />
                </div>
            ))}
        </div>
    )
}


export default function WishlistPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();
    const { wishlist, isLoading: isWishlistLoading } = useWishlist();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login?redirect=/wishlist');
        }
    }, [user, isUserLoading, router]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!firestore || wishlist.length === 0) {
                setProducts([]);
                setIsLoadingProducts(false);
                return;
            }
            setIsLoadingProducts(true);
            try {
                // Firestore 'in' queries are limited to 30 items per query. 
                // For a larger wishlist, you would need to batch requests.
                const productBatches: Product[] = [];
                for (let i = 0; i < wishlist.length; i += 30) {
                    const batch = wishlist.slice(i, i + 30);
                    const q = query(collection(firestore, 'products'), where('__name__', 'in', batch));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        productBatches.push({ id: doc.id, ...(doc.data() as Omit<Product, 'id'>) });
                    });
                }
                setProducts(productBatches);
            } catch (error) {
                console.error("Error fetching wishlist products:", error);
            } finally {
                setIsLoadingProducts(false);
            }
        };

        if (!isWishlistLoading) {
            fetchProducts();
        }
    }, [wishlist, isWishlistLoading, firestore]);

    const isLoading = isUserLoading || isWishlistLoading || isLoadingProducts;

    if (!isUserLoading && !user) {
        return null; // Or a loading spinner, redirecting anyway
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold tracking-tight mb-8">My Wishlist</h1>

            {isLoading ? <WishlistSkeleton /> : (
                products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <Heart className="mx-auto h-24 w-24 text-muted-foreground" />
                        <h2 className="text-2xl font-semibold mt-6">Your Wishlist is Empty</h2>
                        <p className="text-muted-foreground mt-2">
                            Explore products and add your favorites to your wishlist.
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="/products">Discover Products</Link>
                        </Button>
                    </div>
                )
            )}
        </div>
    );
}
