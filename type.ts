import type { ORDER_STATUSES } from '@/utils/helper';

export interface Variant {
  attributeName: string;
  attributeValue: string;
  countInStock: number;
  id: string;
  regularPrice: number;
}
export interface ProductCategoryType {
  _id: string;
  name: string;
}

export interface ProductCategoriesResponse {
  status: string;
  data: ProductCategoryType[];
}
export interface Review {
  comment: string;
  createdAt: string;
  id: string;
  images: string[];
  product: string;
  rating: number;
  user: User;
}
export interface ProductType {
  brand: string;
  category: ProductCategoryType;
  description: string;
  id: string;
  _id: string;
  image: string;
  name: string;
  price: number;
  priceDiscount: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  slug: string;
  variants: Variant[];
}
export interface ProductResponse {
  status: string;
  data: ProductType[];
}

export interface DetailedProductResponse {
  status: string;
  data: DetailedProduct;
}
export interface DetailedProduct extends ProductType {
  reviews: Review[];
}

export interface Address {
  addressLine: string;
  city: string;
  country: string;
  isDefault: boolean;
  postalCode: string;
  state: string;
  _id: string;
}
export interface User {
  addresses: Address[];
  email: string;
  name: string;
  phoneNo: string;
  photo: string;
  role: string;
  _id: string;
  id:string
}

// types/redux.ts
export interface CartItem {
  attributeName: string;
  attributeValue: string;
  priceAtTime: number;
  product: ProductType;
  quantity: number;
  variantId: string;
  _id: string;
}
export interface CartState {
  cart: CartItem[];
}
export interface AuthState {
  user: User;
  isAuthenticated: boolean;
}
export interface ToastState {
  show: boolean;
  message: string;
  success: boolean;
}

export interface RootState {
  userCart: CartState;
  auth: AuthState;
  toast: ToastState;
}
export interface ApiError {
  message: string;
  status: number;
  stack: string;
  response: { data: { message: string } };
}

export interface Address {
  addressLine: string;
  city: string;
  country: string;
  isDefault: boolean;
  postalCode: string;
  state: string;
  _id: string;
}
export interface OrderItem {
  price: number;
  product: ProductType;
  quantity: number;
  variant: { name: string; value: string };
  variantId: string;
  _id: string;
  id: string;
}
export interface Order {
  createdAt: string;
  orderItems: OrderItem[];
  shippingAddress: { address: string; city: string; postalCode: string; country: string };
  status: OrderStatus;
  totalAmount: number;
  user:{name:string,id:string}
  _id: string;
  id: string;
}
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface StatsType {
  totalCustomers: number;
  totalOrders: number;
  totalProductCategories: number;
  totalProducts: number;
  totalRevenue: string;
}
