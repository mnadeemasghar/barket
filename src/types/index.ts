
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  dataAiHint?: string;
  uom: string; // Unit of Measure, e.g., "lb", "each", "dozen"
  rating: number; // e.g., 4.5
  sourceCity: string;
  sourceCountry: string;
}

export interface CartItem extends Product {
  quantity: number;
}
