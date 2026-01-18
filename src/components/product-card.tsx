import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Product } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const productImage = PlaceHolderImages.find(img => img.id === product.imageId);

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
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
        <Button className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </div>
    </div>
  );
}
