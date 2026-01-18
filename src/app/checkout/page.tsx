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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

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
  const tax = totalPrice * 0.08;
  const total = totalPrice + tax;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase.",
    });
    clearCart();
    router.push("/");
  }

  if (cartItems.length === 0) {
    // This is to prevent users from accessing checkout with an empty cart
    // Ideally this would be a redirect in a useEffect, but for simplicity:
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
                  <Button type="submit" size="lg" className="w-full">
                    Place Order (${total.toFixed(2)})
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
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
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
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
