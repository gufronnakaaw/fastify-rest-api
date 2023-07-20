export interface ProductEntity {
  id?: number;
  id_product: string;
  name: string;
  slug: string;
  description: string;
  stock: number;
  price: number;
  seller_id: number;
  created_at?: Date;
  updated_at?: Date;
}
