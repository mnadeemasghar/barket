"use client";

import Image from 'next/image';
import type { CartItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemDisplayProps {
  item: CartItem;
}

export default function CartItemDisplay({ item }: CartItemDisplayProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex items-center gap-x-3 sm:gap-x-4 p-4 border-b">
      <Image
        src={item.imageUrl}
        alt={item.name}
        width={80} // Intrinsic width for aspect ratio calculation
        height={80} // Intrinsic height for aspect ratio calculation
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover flex-shrink-0"
        data-ai-hint={item.dataAiHint || 'product image'}
      />
      <div className="flex-grow space-y-0.5">
        <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 sm:h-9 sm:w-9 shrink-0" 
          onClick={() => handleQuantityChange(item.quantity - 1)} 
          disabled={item.quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
          className="w-10 sm:w-12 text-center h-8 sm:h-9"
          min="1"
          aria-label="Item quantity"
        />
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 sm:h-9 sm:w-9 shrink-0" 
          onClick={() => handleQuantityChange(item.quantity + 1)}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <p className="font-semibold w-auto min-w-[4rem] sm:min-w-[5rem] text-right text-sm sm:text-base">${(item.price * item.quantity).toFixed(2)}</p>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => removeFromCart(item.id)} 
        className="text-destructive hover:text-destructive/80 shrink-0"
        aria-label="Remove item"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
