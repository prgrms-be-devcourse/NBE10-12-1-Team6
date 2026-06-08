export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
};

export type ProductRequest = {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
};

export type ProductSale = {
  id: number;
  sales: number;
};
