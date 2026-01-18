'use client';

import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, Minus, Plus, ShoppingCart, Heart, CheckCircle } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { addDoc, collection, query, where, serverTimestamp, orderBy, doc, limit } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { Product, ProductReview, ProductVariant } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist } from "@/context/wishlist-context";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


function ReviewCard({ review }: { review: ProductReview }) {
  const reviewDate = review.createdAt?.toDate().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="bg-muted/50">
      <CardHeader className="flex-row items-center gap-4 p-4">
        <Avatar className="h-10 w-10">
          {/* Assuming no user avatar in review, using fallback */}
          <AvatarFallback>{review.userName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{review.userName}</p>
          <p className="text-xs text-muted-foreground">{reviewDate}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-primary fill-current' : 'text-muted-foreground'}`} />
          ))}
        </div>
        <p className="text-sm text-foreground">{review.comment}</p>
      </CardContent>
    </Card>
  )
}

function ProductDetailSkeleton() {
    return (
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <Skeleton className="aspect-square relative rounded-lg" />
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-5 w-1/3" />
                </div>
                <Skeleton className="h-8 w-1/4" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-32" />
                    <Skeleton className="h-12 flex-1" />
                </div>
            </div>
        </div>
    )
}


export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { addToCart } = useCart();
  const { isProductInWishlist, toggleProductInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const productId = params.id;

  const productDocRef = useMemoFirebase(() => doc(firestore, 'products', productId), [firestore, productId]);
  const { data: product, isLoading: isProductLoading } = useDoc<Product>(productDocRef);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);
  
  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore || !productId) return null;
    return query(
      collection(firestore, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, productId]);
  const { data: reviews, isLoading: areReviewsLoading } = useCollection<ProductReview>(reviewsQuery);
  
  const relatedProductsQuery = useMemoFirebase(() => {
    if (!firestore || !product) return null;
    return query(
        collection(firestore, 'products'),
        where('category', '==', product.category),
        limit(4) // Fetch a bit more to filter out the current product
    );
  }, [firestore, product]);
  const { data: relatedProductsData, isLoading: areRelatedLoading } = useCollection<Product>(relatedProductsQuery);
  const relatedProducts = relatedProductsData?.filter(p => p.id !== productId).slice(0,3);


  if (!isProductLoading && !product) {
    notFound();
  }
  
  const reviewCount = reviews?.length || 0;
  const avgRating = reviews && reviewCount > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
    : 0;

  const isWishlisted = product ? isProductInWishlist(product.id) : false;

  const productImage = product ? PlaceHolderImages.find((img) => img.id === product.imageId) : null;
  const displayPrice = selectedVariant ? selectedVariant.price : (product?.basePrice || 0);

  const handleAddToCart = () => {
    if (product && selectedVariant) {
        addToCart(product, selectedVariant, quantity);
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore || !product) {
      toast({ variant: 'destructive', title: 'You must be logged in to leave a review.' });
      return;
    }
    if (rating === 0 || comment.trim() === '') {
      toast({ variant: 'destructive', title: 'Please provide a rating and a comment.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'reviews'), {
        userId: user.uid,
        userName: user.displayName || user.email,
        productId: product.id,
        rating,
        comment,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Review submitted!', description: 'Thank you for your feedback.' });
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({ variant: 'destructive', title: 'Failed to submit review.', description: 'Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      {isProductLoading || !product ? <ProductDetailSkeleton /> : (
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
                        {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < avgRating ? 'text-primary fill-current' : 'text-muted-foreground'}`}/>)}
                    </div>
                    <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
                </div>
            </div>

            {product.variants.length > 1 && (
              <div>
                <Label className="text-lg font-medium">Select {product.variants[0].name.toLowerCase().includes('size') ? 'Size' : 'Variant'}</Label>
                 <RadioGroup 
                    value={selectedVariant?.name} 
                    onValueChange={(variantName) => {
                      const variant = product.variants.find(v => v.name === variantName) || null;
                      setSelectedVariant(variant);
                    }}
                    className="flex flex-wrap gap-2 mt-2"
                  >
                  {product.variants.map((variant) => (
                    <div key={variant.name}>
                      <RadioGroupItem value={variant.name} id={variant.name} className="peer sr-only" />
                      <Label
                        htmlFor={variant.name}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        {variant.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            
            <p className="text-3xl font-bold">${displayPrice.toFixed(2)}</p>
            <p className="text-muted-foreground">{product.description}</p>
            
            {selectedVariant && selectedVariant.stock > 0 ? (
               <p className="text-sm text-green-600 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> In Stock ({selectedVariant.stock} available)
               </p>
            ) : (
               <p className="text-sm text-destructive">Out of Stock</p>
            )}

            <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                    <Button variant="ghost" size="icon" onClick={decreaseQuantity}><Minus className="h-4 w-4"/></Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button variant="ghost" size="icon" onClick={increaseQuantity}><Plus className="h-4 w-4"/></Button>
                </div>
                <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!selectedVariant || selectedVariant.stock === 0}>
                    <ShoppingCart className="mr-2 h-5 w-5"/>
                    Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="h-11 w-11" onClick={() => product && toggleProductInWishlist(product.id, product.name)}>
                    <Heart className={cn("h-5 w-5", isWishlisted && "text-destructive fill-current")} />
                    <span className="sr-only">Add to wishlist</span>
                </Button>
            </div>
            </div>
        </div>
      )}
      
      <Separator className="my-16" />

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
          {areReviewsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews yet. Be the first to leave one!</p>
          )}
        </div>
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <h3 className="text-xl font-semibold">Write a Review</h3>
            </CardHeader>
            <CardContent>
              {user ? (
                 <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Your Rating</Label>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => {
                          const starValue = index + 1;
                          return (
                            <Star
                              key={starValue}
                              className={`h-6 w-6 cursor-pointer ${starValue <= (hoverRating || rating) ? 'text-primary fill-current' : 'text-muted-foreground'}`}
                              onMouseEnter={() => setHoverRating(starValue)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setRating(starValue)}
                            />
                          )
                        })}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="comment">Your Review</Label>
                      <Textarea 
                        id="comment" 
                        placeholder="What did you think of the product?" 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting || !product}>
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                 </form>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">You must be logged in to leave a review.</p>
                  <Button asChild>
                    <Link href={`/login?redirect=/products/${productId}`}>Log In</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-16" />

      <div>
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Related Products</h2>
        {areRelatedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="aspect-square rounded-lg" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-6 w-1/4" />
                    </div>
                 ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts?.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
        )}
      </div>
    </div>
  );
}
