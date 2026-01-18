export type Category = {
  id: number;
  name: string;
  slug: string;
};

export const categories: Category[] = [
  { id: 1, name: "Organic Foods", slug: "organic-foods" },
  { id: 2, name: "Fitness Gear", slug: "fitness-gear" },
  { id: 3, name: "Supplements", slug: "supplements" },
  { id: 4, name: "Personal Care", slug: "personal-care" },
];

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  imageId: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Organic Kale",
    price: 3.99,
    category: "Organic Foods",
    description: "Fresh, crisp organic kale, packed with nutrients. Perfect for salads and smoothies.",
    imageId: "product-1",
  },
  {
    id: 2,
    name: "Yoga Mat",
    price: 29.99,
    category: "Fitness Gear",
    description: "Eco-friendly, non-slip yoga mat for your daily practice. Provides excellent grip and cushioning.",
    imageId: "product-2",
  },
  {
    id: 3,
    name: "Plant-Based Protein Powder",
    price: 49.99,
    category: "Supplements",
    description: "20g of protein per serving. A clean, delicious way to build muscle and aid recovery.",
    imageId: "product-3",
  },
  {
    id: 4,
    name: "Organic Quinoa",
    price: 7.99,
    category: "Organic Foods",
    description: "A versatile and complete protein, our organic quinoa is pre-rinsed and ready to cook.",
    imageId: "product-4",
  },
  {
    id: 5,
    name: "Dumbbell Set (5-25 lbs)",
    price: 149.99,
    category: "Fitness Gear",
    description: "Adjustable dumbbell set, perfect for a home gym. Durable and easy to use.",
    imageId: "product-5",
  },
  {
    id: 6,
    name: "Vitamin D3 Gummies",
    price: 19.99,
    category: "Supplements",
    description: "Support your immune system and bone health with these tasty, natural-flavored gummies.",
    imageId: "product-6",
  },
  {
    id: 7,
    name: "Organic Avocado Oil",
    price: 12.99,
    category: "Organic Foods",
    description: "High-heat cooking oil with a neutral flavor. Rich in monounsaturated fats.",
    imageId: "product-7",
  },
  {
    id: 8,
    name: "Resistance Bands Set",
    price: 24.99,
    category: "Fitness Gear",
    description: "Set of 5 resistance bands for a full-body workout. Includes a carrying bag.",
    imageId: "product-8",
  },
  {
    id: 9,
    name: "Organic Coconut Water",
    price: 2.99,
    category: "Organic Foods",
    description: "Naturally hydrating and refreshing, our organic coconut water is packed with electrolytes.",
    imageId: "product-9",
  },
  {
    id: 10,
    name: "Foam Roller",
    price: 19.99,
    category: "Fitness Gear",
    description: "High-density foam roller for muscle recovery and deep tissue massage. Essential for any fitness routine.",
    imageId: "product-10",
  },
  {
    id: 11,
    name: "Collagen Peptides",
    price: 34.99,
    category: "Supplements",
    description: "Unflavored collagen peptides to support healthy hair, skin, nails, and joints. Mixes easily into any liquid.",
    imageId: "product-11",
  },
  {
    id: 12,
    name: "Natural Bar Soap",
    price: 6.99,
    category: "Personal Care",
    description: "Gentle, all-natural bar soap infused with essential oils. Cleanses without stripping moisture.",
    imageId: "product-12",
  },
];
