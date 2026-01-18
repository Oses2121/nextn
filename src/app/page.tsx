'use client';

import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Category, Product } from "@/lib/types";
import { collection, limit, query } from "firebase/firestore";
import Link from "next/link";

function FeaturedProductsSkeleton() {
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

function CategoryLinksSkeleton() {
    return (
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
        </div>
    )
}

export default function HomePage() {
  const firestore = useFirestore();
  
  const productsQuery = useMemoFirebase(
    () => query(collection(firestore, 'products'), limit(4)), 
    [firestore]
  );
  const categoriesQuery = useMemoFirebase(
    () => collection(firestore, 'categories'),
    [firestore]
  );

  const { data: featuredProducts, isLoading: areProductsLoading } = useCollection<Product>(productsQuery);
  const { data: categories, isLoading: areCategoriesLoading } = useCollection<Category>(categoriesQuery);

  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      <HeroCarousel />
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">
          Featured Products
        </h2>
        {areProductsLoading ? <FeaturedProductsSkeleton /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        )}
        <div className="text-center mt-8">
          <Button asChild>
            <Link href="/products">Shop All</Link>
          </Button>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-8">
            Shop by Category
          </h2>
          {areCategoriesLoading ? <CategoryLinksSkeleton /> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories?.map((category) => (
                <Link
                    href={`/products?category=${category.slug}`}
                    key={category.id}
                    className="block group"
                >
                    <div className="bg-card p-6 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    </div>
                </Link>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
