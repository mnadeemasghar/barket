
"use client";

import Image from 'next/image';
import Link from 'next/link'; // Import Link
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Minus, Plus, Star, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface ProductCardProps {
  product: Product;
}

// Helper function to render stars, consistent with product detail page
const renderRatingStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5; // Show full star for .5 or more
  const starElements = [];
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starElements.push(<Star key={`full-${i}`} className="h-4 w-4 fill-primary text-primary" />);
    } else if (i === fullStars && halfStar) {
      starElements.push(<Star key={`half-${i}`} className="h-4 w-4 fill-primary text-primary" />);
    } else {
      starElements.push(<Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />);
    }
  }
  return starElements;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding to cart
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/product/${product.id}`} aria-label={`View details for ${product.name}`}>
          <div className="aspect-[4/3] relative w-full overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={product.dataAiHint || 'food product'}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-2">
        <CardTitle className="text-lg font-semibold">
          <Link href={`/product/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </CardTitle>
        
        <div className="flex items-center gap-1">
          {renderRatingStars(product.rating)}
          <span className="text-xs text-muted-foreground">({product.rating.toFixed(1)})</span>
        </div>
        
        <CardDescription className="text-sm text-muted-foreground h-12 overflow-hidden text-ellipsis">
          {product.description}
        </CardDescription>
        
        <div className="flex items-baseline gap-1">
          <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
          <span className="text-xs text-muted-foreground">/ {product.uom}</span>
        </div>

        <div className="text-xs text-muted-foreground flex items-center">
          <MapPin className="h-3 w-3 mr-1.5 flex-shrink-0" />
          <span>{product.sourceCity}, {product.sourceCountry}</span>
        </div>
        
        <div className="flex items-center gap-2 pt-1">
          <span className="text-sm text-muted-foreground mr-1">Qty:</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setQuantity(val > 0 ? val : 1);
            }}
            className="w-12 h-8 text-center rounded-md"
            min="1"
            aria-label="Product quantity"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => setQuantity(quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleAddToCart}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
