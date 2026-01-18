"use client";

import Slider from "react-slick";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function HeroCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  const heroImages = [
    PlaceHolderImages.find((img) => img.id === "hero-1"),
    PlaceHolderImages.find((img) => img.id === "hero-2"),
    PlaceHolderImages.find((img) => img.id === "hero-3"),
  ];

  const heroContent = [
    {
      title: "Fresh Organic Vegetables",
      description: "Straight from the farm to your table. Healthy and delicious.",
      buttonText: "Shop Vegetables",
      href: "/products?category=organic-foods",
    },
    {
      title: "Achieve Your Fitness Goals",
      description: "High-quality gear and supplements to support your journey.",
      buttonText: "Explore Fitness",
      href: "/products?category=fitness-gear",
    },
    {
      title: "Natural Health Supplements",
      description: "Boost your well-being with our range of natural supplements.",
      buttonText: "Discover Supplements",
      href: "/products?category=supplements",
    },
  ];

  return (
    <div className="w-full">
      <Slider {...settings}>
        {heroImages.map((image, index) =>
          image ? (
            <div key={image.id} className="relative h-[60vh] md:h-[80vh]">
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                style={{ objectFit: "cover" }}
                data-ai-hint={image.imageHint}
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center">
                <div className="container mx-auto px-4 text-white">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {heroContent[index].title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                    {heroContent[index].description}
                  </p>
                  <Button size="lg" asChild>
                    <Link href={heroContent[index].href}>{heroContent[index].buttonText}</Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : null
        )}
      </Slider>
    </div>
  );
}
