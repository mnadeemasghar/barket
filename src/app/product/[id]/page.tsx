
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation'; // Corrected: useParams from next/navigation
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';

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
      // Optionally reset quantity or provide other feedback
      // setQuantity(1); 
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
            <div className="aspect-square relative w-full overflow-hidden rounded-t-lg md:rounded-lg">
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
              <CardDescription className="text-base text-muted-foreground leading-relaxed">
                {product.description}
              </CardDescription>
              <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
              
              <div className="flex items-center gap-3 pt-2">
                <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
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
                    className="w-16 h-9 text-center"
                    min="1"
                    aria-label="Product quantity"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
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
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>

      {/* Placeholder for Related Products */}
      {/* <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.filter(p => p.id !== product.id && p.category === product.category).slice(0,4).map(relatedProduct => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </div> */}
    </div>
  );
}
