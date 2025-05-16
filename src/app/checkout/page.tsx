"use client";

import CheckoutForm from '@/components/checkout/CheckoutForm';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cartItems, getCartTotal, getCartItemCount } = useCart();
  const router = useRouter();
  const totalAmount = getCartTotal();
  const itemCount = getCartItemCount();

  useEffect(() => {
    if (itemCount === 0) {
      router.replace('/cart'); // Use replace to avoid back button to empty checkout
    }
  }, [itemCount, router]);

  if (itemCount === 0) {
    // This will be briefly shown before redirect, or if redirect fails.
    return <div className="container py-12 text-center">Loading or redirecting...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <CheckoutForm />
        </div>
        <div className="order-first md:order-last">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center gap-2 border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Image 
                      src={item.imageUrl} 
                      alt={item.name} 
                      width={40} 
                      height={40} 
                      className="rounded"
                      data-ai-hint={item.dataAiHint || 'product image'}
                    />
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="flex justify-between font-semibold pt-4">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
