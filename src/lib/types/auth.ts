export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
  };
}


export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  [key: string]: any;
} 



export interface Zone {
  id: string;
  name: string;
  description: string;  
  status: "active" | "inactive";
  createdAt: string;
}

export interface ZoneResponse {
  zones: Zone[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}



export interface Product {
  id: string;
  name: string;
  size: string;
  price: number;
  description?: string;
  image?: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface ProductResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}