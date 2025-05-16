
"use client";

import { useState, useEffect } from 'react';
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
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Helper function to render stars
const renderRatingStars = (rating: number) => {
  const starElements = [];
  for (let i = 0; i < 5; i++) {
    const roundedRating = Math.round(rating * 2) / 2; 
    if (i < Math.floor(roundedRating)) { 
      starElements.push(<Star key={`full-${i}`} className="h-5 w-5 fill-primary text-primary" />);
    } else if (i < roundedRating) { 
      starElements.push(<Star key={`half-${i}`} className="h-5 w-5 fill-primary text-primary" />); 
    }
     else { 
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
  const [product, setProduct] = useState<Product | null | undefined>(undefined); 

  useEffect(() => {
    if (id) {
      const foundProduct = products.find(p => p.id === id);
      // Simulate a small delay for loading spinner visibility if needed for testing
      // setTimeout(() => setProduct(foundProduct || null), 500);
      setProduct(foundProduct || null); 
    }
  }, [id]);

  if (product === undefined) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[calc(100vh-200px)] md:min-h-[300px]">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  return (
    <div className="container py-6 md:py-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>

      <Card className="overflow-hidden shadow-xl rounded-lg">
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
          
          <div className="flex flex-col justify-between h-full p-4 sm:p-6 md:py-6 md:pr-6">
            <CardContent className="p-0 space-y-3 sm:space-y-4">
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold">{product.name}</CardTitle>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderRatingStars(product.rating)}
                </div>
                <span className="text-sm text-muted-foreground">({product.rating.toFixed(1)} rating based on user reviews)</span>
              </div>

              <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-2">
                {product.description}
              </CardDescription>
              
              <div className="flex items-baseline gap-2 pt-2">
                <p className="text-2xl sm:text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
                <span className="text-sm text-muted-foreground">/ {product.uom}</span>
              </div>

              <div className="text-sm text-muted-foreground flex items-center pt-1">
                <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                Sourced from: {product.sourceCity}, {product.sourceCountry}
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <span className="text-sm font-medium">Quantity:</span>
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
                    className="w-14 sm:w-16 h-9 text-center rounded-md"
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

            <CardFooter className="p-0 pt-6 md:pt-8">
              <Button 
                variant="default" 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-md py-6 text-base" 
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}
