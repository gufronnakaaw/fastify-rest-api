export interface SellerEntity {
  id?: number;
  id_seller: string;
  domain: string;
  name: string;
  email: string;
  phone?: string;
  description?: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}
