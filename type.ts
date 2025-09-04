export interface Variant {
  attributeName: string;
  attributeValue: string;
  countInStock: number;
  id: string;
  regularPrice: number;
}
export interface Category {
  _id: string;
  name: string;
}
export interface Product {
  brand: string;
  category: Category;
  description: string;
  id: string;
  image: string;
  name: string;
  price: number;
  priceDiscount: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  slug: string;
  variants: Variant[];
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
}

// types/redux.ts
export interface CartItem {
  attributeName: string;
  attributeValue: string;
  priceAtTime: number;
  product: Product;
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
}
