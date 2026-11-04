export interface Product {
  _id: string;
  id?: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  category: string;
  stock: number;
  description?: string;
  specifications?: Record<string, string>;
}

export interface CartItem {
  id: number;
  productId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  fullName: string;
  phone: string;
  address: string;
  avatar?: string;
  password?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface SearchFilters {
  priceRange: [number, number];
  brands: string[];
  categories: string[];
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  paymentStatus: string;
  createdAt: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface OrderData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: 'cod' | 'bank';
  note?: string;
}