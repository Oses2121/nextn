'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Product } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const productImage = PlaceHolderImages.find(img => img.id === product.imageId);
    const { addToCart } = useCart();
    const { isProductInWishlist, toggleProductInWishlist } = useWishlist();

    const isWishlisted = isProductInWishlist(product.id);

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group relative">
      <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 z-10 rounded-full h-8 w-8 bg-background/50 hover:bg-background"
          onClick={(e) => {
              e.preventDefault(); // prevent link navigation
              toggleProductInWishlist(product.id, product.name);
          }}
      >
          <Heart className={cn("h-4 w-4", isWishlisted && "text-destructive fill-current")} />
          <span className="sr-only">Add to wishlist</span>
      </Button>
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-square relative">
            {productImage && 
                <Image
                    src={productImage.imageUrl}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    data-ai-hint={productImage.imageHint}
                />
            }
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-muted-foreground text-sm">{product.category}</p>
          <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <Button className="w-full" onClick={() => addToCart(product)}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </div>
    </div>
  );
}
