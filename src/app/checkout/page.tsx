
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useUser, useFirestore } from "@/firebase";
import { runTransaction, doc, collection, serverTimestamp } from "firebase/firestore";
import type { Product } from "@/lib/types";

const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zip: z.string().min(1, "ZIP code is required"),
  cardNumber: z.string().min(16).max(16).regex(/^\d+$/, "Card number must be digits"),
  expiryDate: z.string().min(5).max(5).regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvc: z.string().min(3).max(4).regex(/^\d+$/, "CVC must be digits"),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useUser();
  const firestore = useFirestore();
  const tax = totalPrice * 0.08;
  const total = totalPrice + tax;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      zip: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to place an order.",
      });
      router.push('/login');
      return;
    }

    // Exclude payment details from being saved
    const { cardNumber, expiryDate, cvc, ...shippingInfo } = values;

    try {
        await runTransaction(firestore, async (transaction) => {
            const stockIssues: string[] = [];

            // 1. Create a map of product IDs to their required quantities
            const productQuantities: Record<string, { item: typeof cartItems[0], quantity: number }[]> = {};
            for (const item of cartItems) {
                if (!productQuantities[item.productId]) {
                    productQuantities[item.productId] = [];
                }
                productQuantities[item.productId].push({ item, quantity: item.quantity });
            }
            
            const productIds = Object.keys(productQuantities);
            const productRefs = productIds.map(id => doc(firestore, 'products', id));
            const productSnapshots = await Promise.all(productRefs.map(ref => transaction.get(ref)));

            // 2. Validate stock and prepare updates for all items
            for (let i = 0; i < productSnapshots.length; i++) {
                const productSnap = productSnapshots[i];
                const productId = productIds[i];

                if (!productSnap.exists()) {
                    throw new Error(`A product in your cart could not be found.`);
                }
                
                const productData = productSnap.data() as Product;
                const itemsToPurchase = productQuantities[productId];

                for (const { item, quantity } of itemsToPurchase) {
                    const variant = productData.variants.find(v => v.name === item.variantName);

                    if (!variant) {
                         throw new Error(`Variant ${item.variantName} for ${item.name} not found.`);
                    }

                    if (variant.stock < quantity) {
                        stockIssues.push(`${item.name} - ${item.variantName} (only ${variant.stock} left)`);
                    }
                }
            }

            if (stockIssues.length > 0) {
                // This error will be caught by the outer catch block
                throw new Error(`Some items are out of stock: ${stockIssues.join(', ')}`);
            }

            // 3. If all stocks are fine, perform the updates
            for (let i = 0; i < productSnapshots.length; i++) {
                const productSnap = productSnapshots[i];
                const productRef = productRefs[i];
                const productData = productSnap.data() as Product;
                const itemsToPurchase = productQuantities[productData.id];

                const newVariants = productData.variants.map(variant => {
                    const item = itemsToPurchase.find(p => p.item.variantName === variant.name);
                    if (item) {
                        return { ...variant, stock: variant.stock - item.quantity };
                    }
                    return variant;
                });

                transaction.update(productRef, { variants: newVariants });
            }

            // 4. Create the new order
            const orderRef = doc(collection(firestore, `users/${user.uid}/orders`));
            const orderItems = cartItems.map(item => ({
                productId: item.productId,
                name: item.name,
                variantName: item.variantName,
                price: item.price,
                quantity: item.quantity,
                imageId: item.imageId,
                category: item.category,
            }));
            
            transaction.set(orderRef, {
                userId: user.uid,
                createdAt: serverTimestamp(),
                total: total,
                items: orderItems,
                shippingInfo: shippingInfo,
            });
        });
        
        // If transaction is successful
        toast({
            title: "Order Placed!",
            description: "Thank you for your purchase.",
        });
        clearCart();
        router.push("/orders");

    } catch (error: any) {
        console.error("Error placing order: ", error);
        toast({
            variant: "destructive",
            title: "Order Failed",
            description: error.message || "There was a problem placing your order. Please try again.",
        });
    }
  }

  if (cartItems.length === 0) {
     return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold">Your cart is empty.</h1>
            <p className="text-muted-foreground mt-2">Add some products before checking out.</p>
            <Button asChild className="mt-6">
                <Link href="/products">Go Shopping</Link>
            </Button>
        </div>
     );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                      <h3 className="text-lg font-medium">Contact Information</h3>
                      <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                          <FormMessage />
                          </FormItem>
                      )} />
                  </div>
                  <Separator />
                  <div className="space-y-4">
                      <h3 className="text-lg font-medium">Shipping Address</h3>
                      <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name="firstName" render={({ field }) => (
                              <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                              </FormItem>
                          )} />
                          <FormField control={form.control} name="lastName" render={({ field }) => (
                              <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                              </FormItem>
                          )} />
                      </div>
                      <FormField control={form.control} name="address" render={({ field }) => (
                          <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                          </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name="city" render={({ field }) => (
                              <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                              </FormItem>
                          )} />
                          <FormField control={form.control} name="zip" render={({ field }) => (
                              <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                              </FormItem>
                          )} />
                      </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                      <h3 className="text-lg font-medium">Payment Details</h3>
                      <FormField control={form.control} name="cardNumber" render={({ field }) => (
                          <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl>
                          <FormMessage />
                          </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name="expiryDate" render={({ field }) => (
                              <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                              <FormMessage />
                              </FormItem>
                          )} />
                          <FormField control={form.control} name="cvc" render={({ field }) => (
                              <FormItem>
                              <FormLabel>CVC</FormLabel>
                              <FormControl><Input placeholder="•••" {...field} /></FormControl>
                              <FormMessage />
                              </FormItem>
                          )} />
                      </div>
                  </div>
                  {user ? (
                    <Button type="submit" size="lg" className="w-full" disabled={!form.formState.isValid}>
                        Place Order (${total.toFixed(2)})
                    </Button>
                  ) : (
                    <Button size="lg" className="w-full" asChild>
                        <Link href="/login?redirect=/checkout">Login to Place Order</Link>
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1 sticky top-24">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {cartItems.map(item => {
                        const productImage = PlaceHolderImages.find(img => img.id === item.imageId);
                        return (
                            <div key={item.id} className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                    {productImage && <Image src={productImage.imageUrl} alt={item.name} fill style={{objectFit: 'cover'}} data-ai-hint={productImage.imageHint} />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.variantName !== 'Default' ? `${item.variantName}, ` : ''} 
                                      Qty: {item.quantity}
                                    </p>
                                </div>
                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        )
                    })}
                    <Separator />
                     <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Taxes (8%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
