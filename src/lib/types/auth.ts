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


// src/lib/types/customer.ts
export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  address: string;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  status: "active" | "inactive" | "sleeping" | "overdue"; 
  createdAt: string;
}

export interface CustomerCounts {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
}

export interface CustomerPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CustomerListResponse {
  customers: Customer[];
  counts: CustomerCounts;
  pagination: CustomerPagination;
}

export interface StatusPayload  {
  id: string;
  status: Customer["status"];
};





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