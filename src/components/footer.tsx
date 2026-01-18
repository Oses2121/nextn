'use client';

import { Leaf, Twitter, Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Category } from "@/lib/types";

export function Footer() {
  const firestore = useFirestore();
  const categoriesQuery = useMemoFirebase(() => collection(firestore, 'categories'), [firestore]);
  const { data: categories } = useCollection<Category>(categoriesQuery);

  return (
    <footer className="bg-muted text-muted-foreground py-8 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground mb-4">
            <Leaf className="h-6 w-6 text-primary" />
            Verdure
          </Link>
          <p className="text-sm">
            Your source for the best organic food and fitness products.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-primary">All Products</Link></li>
            {categories?.map(category => (
                <li key={category.id}>
                    <Link href={`/products?category=${category.slug}`} className="hover:text-primary">
                        {category.name}
                    </Link>
                </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-4">About Us</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-primary">Our Story</Link></li>
            <li><Link href="#" className="hover:text-primary">Contact</Link></li>
            <li><Link href="#" className="hover:text-primary">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-primary"><Twitter /></Link>
            <Link href="#" className="hover:text-primary"><Instagram /></Link>
            <Link href="#" className="hover:text-primary"><Facebook /></Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-border text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Verdure. All rights reserved.</p>
      </div>
    </footer>
  );
}
