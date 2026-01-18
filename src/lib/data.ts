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
  stock: number;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Organic Kale",
    price: 3.99,
    category: "Organic Foods",
    description: "Fresh, crisp organic kale, packed with nutrients. Perfect for salads and smoothies.",
    imageId: "product-1",
    stock: 150,
  },
  {
    id: 2,
    name: "Yoga Mat",
    price: 29.99,
    category: "Fitness Gear",
    description: "Eco-friendly, non-slip yoga mat for your daily practice. Provides excellent grip and cushioning.",
    imageId: "product-2",
    stock: 75,
  },
  {
    id: 3,
    name: "Plant-Based Protein Powder",
    price: 49.99,
    category: "Supplements",
    description: "20g of protein per serving. A clean, delicious way to build muscle and aid recovery.",
    imageId: "product-3",
    stock: 50,
  },
  {
    id: 4,
    name: "Organic Quinoa",
    price: 7.99,
    category: "Organic Foods",
    description: "A versatile and complete protein, our organic quinoa is pre-rinsed and ready to cook.",
    imageId: "product-4",
    stock: 120,
  },
  {
    id: 5,
    name: "Dumbbell Set (5-25 lbs)",
    price: 149.99,
    category: "Fitness Gear",
    description: "Adjustable dumbbell set, perfect for a home gym. Durable and easy to use.",
    imageId: "product-5",
    stock: 30,
  },
  {
    id: 6,
    name: "Vitamin D3 Gummies",
    price: 19.99,
    category: "Supplements",
    description: "Support your immune system and bone health with these tasty, natural-flavored gummies.",
    imageId: "product-6",
    stock: 200,
  },
  {
    id: 7,
    name: "Organic Avocado Oil",
    price: 12.99,
    category: "Organic Foods",
    description: "High-heat cooking oil with a neutral flavor. Rich in monounsaturated fats.",
    imageId: "product-7",
    stock: 80,
  },
  {
    id: 8,
    name: "Resistance Bands Set",
    price: 24.99,
    category: "Fitness Gear",
    description: "Set of 5 resistance bands for a full-body workout. Includes a carrying bag.",
    imageId: "product-8",
    stock: 100,
  },
  {
    id: 9,
    name: "Organic Coconut Water",
    price: 2.99,
    category: "Organic Foods",
    description: "Naturally hydrating and refreshing, our organic coconut water is packed with electrolytes.",
    imageId: "product-9",
    stock: 300,
  },
  {
    id: 10,
    name: "Foam Roller",
    price: 19.99,
    category: "Fitness Gear",
    description: "High-density foam roller for muscle recovery and deep tissue massage. Essential for any fitness routine.",
    imageId: "product-10",
    stock: 90,
  },
  {
    id: 11,
    name: "Collagen Peptides",
    price: 34.99,
    category: "Supplements",
    description: "Unflavored collagen peptides to support healthy hair, skin, nails, and joints. Mixes easily into any liquid.",
    imageId: "product-11",
    stock: 60,
  },
  {
    id: 12,
    name: "Natural Bar Soap",
    price: 6.99,
    category: "Personal Care",
    description: "Gentle, all-natural bar soap infused with essential oils. Cleanses without stripping moisture.",
    imageId: "product-12",
    stock: 250,
  },
  {
    id: 13,
    name: "Kombucha Starter Kit",
    price: 45.99,
    category: "Organic Foods",
    description: "Brew your own delicious and healthy kombucha at home with our complete starter kit.",
    imageId: "product-13",
    stock: 40,
  },
  {
    id: 14,
    name: "Essential Oil Diffuser",
    price: 39.99,
    category: "Personal Care",
    description: "Create a relaxing atmosphere with this ultrasonic essential oil diffuser.",
    imageId: "product-14",
    stock: 55,
  },
  {
    id: 15,
    name: "Insulated Water Bottle",
    price: 25.0,
    category: "Fitness Gear",
    description: "Keep your drinks cold for 24 hours or hot for 12. Stainless steel and BPA-free.",
    imageId: "product-15",
    stock: 120,
  },
  {
    id: 16,
    name: "Organic Fair Trade Coffee",
    price: 15.99,
    category: "Organic Foods",
    description: "Whole bean, medium roast coffee with notes of chocolate and citrus.",
    imageId: "product-16",
    stock: 95,
  },
  {
    id: 17,
    name: "Adjustable Jump Rope",
    price: 14.99,
    category: "Fitness Gear",
    description: "A perfect tool for cardio training. Lightweight and adjustable for all heights.",
    imageId: "product-17",
    stock: 150,
  },
  {
    id: 18,
    name: "Natural Deodorant",
    price: 12.99,
    category: "Personal Care",
    description: "Aluminum-free deodorant with a refreshing scent. All-day protection without harsh chemicals.",
    imageId: "product-18",
    stock: 110,
  },
];
