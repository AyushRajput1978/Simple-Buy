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
