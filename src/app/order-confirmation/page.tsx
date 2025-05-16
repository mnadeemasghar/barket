import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function OrderConfirmationPage() {
  return (
    <div className="container py-16 text-center">
      <CheckCircle2 className="mx-auto h-20 w-20 text-primary mb-6" />
      <h1 className="text-3xl font-bold mb-4">Thank You For Your Order!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Your organic goodies are on their way. We've sent a confirmation email with your order details.
      </p>
      <Button asChild size="lg" variant="default" className="bg-primary hover:bg-primary/90">
        <Link href="/">Continue Shopping</Link>
      </Button>
    </div>
  );
}
