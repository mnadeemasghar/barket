
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Minus, Plus, ShoppingCart, Star, MapPin } from 'lucide-react';
import type { Product } from '@/types';

// Helper function to render stars
const renderRatingStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5; // Simplified: show full star for .5 or more
  const starElements = [];
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starElements.push(<Star key={`full-${i}`} className="h-5 w-5 fill-primary text-primary" />);
    } else if (i === fullStars && halfStar) {
      // For simplicity, we'll use a full star for half-star representation for now
      // Or you could use StarHalf icon if you prefer and handle its logic
      starElements.push(<Star key={`half-${i}`} className="h-5 w-5 fill-primary text-primary" />);
    } else {
      starElements.push(<Star key={`empty-${i}`} className="h-5 w-5 text-muted-foreground" />);
    }
  }
  return starElements;
};


export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  return (
    <div className="container py-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
          <CardHeader className="p-0 md:p-6">
            <div className="aspect-square relative w-full overflow-hidden rounded-t-lg md:rounded-lg shadow-md">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={product.dataAiHint || 'product detail'}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </CardHeader>
          
          <div className="flex flex-col justify-between h-full p-6 md:p-0 md:pt-6">
            <CardContent className="p-0 space-y-4">
              <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderRatingStars(product.rating)}
                </div>
                <span className="text-sm text-muted-foreground">({product.rating.toFixed(1)} rating)</span>
              </div>

              <CardDescription className="text-base text-muted-foreground leading-relaxed">
                {product.description}
              </CardDescription>
              
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
                <span className="text-sm text-muted-foreground">{product.uom}</span>
              </div>

              <div className="text-sm text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1.5" />
                Sourced from: {product.sourceCity}, {product.sourceCountry}
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-full"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setQuantity(val > 0 ? val : 1);
                    }}
                    className="w-16 h-9 text-center rounded-md"
                    min="1"
                    aria-label="Product quantity"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-full"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-0 pt-6 md:pb-6">
              <Button 
                variant="default" 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-md" 
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>

      {/* Future placeholder for Related Products or Reviews */}
      {/* <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        ...
      </div> */}
    </div>
  );
}
