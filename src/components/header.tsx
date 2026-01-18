"use client";

import Link from "next/link";
import {
  Leaf,
  Menu,
  Search,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/firebase";
import { UserNav } from "./user-nav";
import { Skeleton } from "./ui/skeleton";
import { useCart } from "@/context/cart-context";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/products", label: "All Products" },
  { href: "/products?category=organic-foods", label: "Organic Foods" },
  { href: "/products?category=fitness-gear", label: "Fitness" },
  { href: "/products?category=supplements", label: "Supplements" },
];

export function Header() {
  const isMobile = useIsMobile();
  const { user, isUserLoading } = useUser();
  const { cartCount } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery(""); 
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link
          href="/"
          className="mr-6 flex items-center gap-2 font-bold text-lg"
        >
          <Leaf className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">Verdure</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{cartCount}</Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>

          {isUserLoading ? (
             <Skeleton className="h-8 w-24" />
          ) : user ? (
            <UserNav />
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}


          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-primary"
                    >
                    {link.label}
                    </Link>
                ))}
                 <hr />
                  {isUserLoading ? (
                    <div className="flex flex-col gap-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : user ? (
                    <p>Welcome, {user.displayName || user.email}</p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Button variant="outline" asChild>
                        <Link href="/login">Log In</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
