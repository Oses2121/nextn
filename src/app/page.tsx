import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { categories, products } from "@/lib/data";
import Link from "next/link";

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      <HeroCarousel />
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
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
        </div>
      </section>
    </div>
  );
}
