'use client';

import { products } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, Minus, Plus, ShoppingCart } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { notFound } from "next/navigation";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === parseInt(params.id));
  
  if (!product) {
    notFound();
  }

  const productImage = PlaceHolderImages.find((img) => img.id === product.imageId);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square relative rounded-lg overflow-hidden border">
            {productImage && (
              <Image
                src={productImage.imageUrl}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                data-ai-hint={productImage.imageHint}
              />
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <span className="text-sm text-muted-foreground">{product.category}</span>
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-primary fill-current' : 'text-muted-foreground'}`}/>)}
                </div>
                <span className="text-sm text-muted-foreground">(12 reviews)</span>
            </div>
          </div>
          <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground">{product.description}</p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={decreaseQuantity}><Minus className="h-4 w-4"/></Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={increaseQuantity}><Plus className="h-4 w-4"/></Button>
            </div>
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5"/>
                Add to Cart
            </Button>
          </div>
        </div>
      </div>
      
      <Separator className="my-16" />

      <div>
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
