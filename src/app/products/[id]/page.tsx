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
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { addDoc, collection, query, where, serverTimestamp, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { ProductReview } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";


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


export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) {
    notFound();
  }
  
  const productId = product.id;

  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore || !productId) return null;
    return query(
      collection(firestore, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, productId]);

  const { data: reviews, isLoading: areReviewsLoading } = useCollection<ProductReview>(reviewsQuery);
  
  const reviewCount = reviews?.length || 0;
  const avgRating = reviews && reviewCount > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
    : 0;


  const productImage = PlaceHolderImages.find((img) => img.id === product.imageId);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) {
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
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                 </form>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">You must be logged in to leave a review.</p>
                  <Button asChild>
                    <Link href={`/login?redirect=/products/${product.id}`}>Log In</Link>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
