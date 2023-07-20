export interface CreateProductDTO {
  name: string;
  description: string;
  stock: number;
  price: number;
}

export interface ResponseCreateProductDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  stock: number;
  price: number;
  seller_id: string;
}
