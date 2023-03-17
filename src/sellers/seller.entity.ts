export interface SellerEntity {
  id?: number;
  domain: string;
  name: string;
  email: string;
  phone?: string;
  description?: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}
