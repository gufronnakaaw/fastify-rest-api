export interface CreateSellerDTO {
  domain: string;
  name: string;
  email: string;
  phone?: string;
  description?: string;
  password: string;
}

export interface ResponseCreateSellerDTO {
  id: string;
  domain: string;
  name: string;
  email: string;
  phone?: string;
  description?: string;
}

export interface LoginSellerDTO {
  email: string;
  password: string;
}

export interface ResponseLoginSellerDTO {
  token: string;
}
