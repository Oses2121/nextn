'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { ProductCard } from '@/components/product-card';
import { products, categories } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  // Initialize filters from URL search params
  useEffect(() => {
    const categoryFilter = searchParams.get('category');
    if (categoryFilter) {
      setSelectedCategories([categoryFilter]);
    }
  }, [searchParams]);

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(categorySlug)
        ? prev.filter((slug) => slug !== categorySlug)
        : [...prev, categorySlug];

      // Update URL - for simplicity, this demo only syncs the first category to the URL
      const params = new URLSearchParams(searchParams);
      if (newCategories.length > 0) {
        params.set('category', newCategories[0]);
      } else {
        params.delete('category');
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });

      return newCategories;
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 200]);
    router.replace(pathname, { scroll: false });
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category.toLowerCase().replace(/\s+/g, '-'))
      );
    }

    // Filter by price
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort products
    switch (sortOrder) {
      case 'price-asc':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
      case 'featured':
      default:
        return filtered;
    }
  }, [selectedCategories, sortOrder, priceRange]);

  const currentCategoryName =
    selectedCategories.length === 1
      ? categories.find((c) => c.slug === selectedCategories[0])?.name
      : 'All Products';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <div className="space-y-8 sticky top-24">
            <div>
              <h3 className="text-lg font-semibold mb-3">Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={category.slug}
                      checked={selectedCategories.includes(category.slug)}
                      onCheckedChange={() => handleCategoryChange(category.slug)}
                    />
                    <Label
                      htmlFor={category.slug}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <Slider
                defaultValue={[0, 200]}
                max={200}
                step={10}
                value={priceRange}
                onValueChange={(value) =>
                  setPriceRange(value as [number, number])
                }
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            <div>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              {currentCategoryName}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredAndSortedProducts.length} products
              </span>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Alphabetically, A-Z</SelectItem>
                  <SelectItem value="name-desc">Alphabetically, Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h2 className="text-2xl font-semibold">No Products Found</h2>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
