import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';

export default function HomePage() {
  return (
    <div className="container py-6 md:py-8">
      <h1 className="text-3xl font-bold mb-6 md:mb-8 text-center">Our Fresh Selection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
