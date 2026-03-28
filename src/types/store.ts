export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured?: boolean;
  sortOrder?: number;
  linkLabel?: string;
};

export type ProductVariantOption = {
  label: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  value: string;
  priceModifier?: number;
  stock?: number;
  options?: ProductVariantOption[];
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  comment: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  categorySlug: string;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  images: string[];
  variants?: ProductVariant[];
  tags?: string[];
  showTagsOnHome?: boolean;
  sku?: string;
  weightGrams?: number;
  dimensions?: {
    height: number;
    width: number;
    length: number;
  };
  reviews?: ProductReview[];
};

export type CartItem = {
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  quantity: number;
  price: number;
  variantLabel?: string;
  categorySlug?: string;
  weightGrams?: number;
};

export type AdminTaskOrder = {
  id: string;
  clientName: string;
  channel: "whatsapp" | "manual" | "mercadopago";
  status: "pending" | "paid" | "preparing" | "delivered";
  total: number;
  notes?: string;
  createdAt: string;
};

export type HeroBanner = {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  image?: string;
  active?: boolean;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type Coupon = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  description: string;
  active: boolean;
};

export type ShippingQuote = {
  serviceName: string;
  deliveredType: "D" | "S";
  price: number;
  deliveryTimeMin?: string;
  deliveryTimeMax?: string;
};

export type CustomerCheckout = {
  fullName: string;
  email: string;
  phone: string;
  postalCode: string;
  address: string;
  notes?: string;
};
