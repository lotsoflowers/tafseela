export type BilingualText = {
  en: string;
  ar: string;
};

export type Language = 'en' | 'ar';

export type Direction = 'ltr' | 'rtl';

export type FitType =
  | 'true-to-size'
  | 'runs-small'
  | 'runs-large'
  | 'runs-tight'
  | 'runs-loose';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type Product = {
  id: string;
  name: BilingualText;
  description: BilingualText;
  price: number;
  images: string[];
  categoryId: string;
  storeId: string;
  sizes: ProductSize[];
  availableSizes: ProductSize[];
  fit: FitType;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isOutOfStock: boolean;
  tags?: BilingualText[];
};

export type Store = {
  id: string;
  name: BilingualText;
  description: BilingualText;
  logo: string;
  banner: string;
  rating: number;
  productCount: number;
  reviewCount: number;
};

export type Category = {
  id: string;
  name: BilingualText;
  slug: string;
};

export type Review = {
  id: string;
  productId: string;
  userName: BilingualText;
  rating: number;
  text: BilingualText;
  fit: FitType;
  images?: string[];
  createdAt: string;
};

export type CartItem = {
  productId: string;
  storeId: string;
  size: ProductSize;
  quantity: number;
};

export type OrderStatus =
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out-for-delivery'
  | 'delivered';

export type DeliveryAddress = {
  fullName: string;
  phone: string;
  area: BilingualText;
  block: string;
  street: string;
  building: string;
  floor?: string;
  apartment?: string;
  notes?: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: 'knet' | 'visa' | 'cod' | 'apple-pay';
  createdAt: string;
  estimatedDelivery: string;
  trackingUpdates: {
    status: OrderStatus;
    timestamp: string;
    note: BilingualText;
  }[];
};

export type User = {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  addresses: DeliveryAddress[];
};

export type FitProfile = {
  height: number;
  weight: number;
  usualSize?: ProductSize;
  preferredFit?: 'fitted' | 'regular' | 'loose';
};

export type FitRecommendation = {
  recommendedSize: ProductSize;
  confidence: 'high' | 'medium' | 'low';
  note: BilingualText;
};
