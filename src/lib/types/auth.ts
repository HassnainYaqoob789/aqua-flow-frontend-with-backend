// ==========================
// AUTH
// ==========================
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

// ==========================
// CUSTOMER
// ==========================
export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  address: string;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  zoneId?: string | null;
  status: "active" | "inactive" | "sleeping" | "overdue";
  createdAt: string;

zone?: {
    id: string;
    name: string;
  } | null;

  lastOrderDate?: string | null;
  empties?: number;
  bottlesGiven?: number;
  totalSpent?: number;
  dueAmount?: number;
  securityDeposit?: number;
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

export interface StatusPayload {
  id: string;
  status: Customer["status"];
}

// ==========================
// ZONES
// ==========================
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

// ==========================
// PRODUCTS
// ==========================
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

// ==========================
// DRIVERS
// ==========================
export interface Driver {
  id: string;
  name: string;
  contact: string;
  vehicleId: string;
  zoneId?: string | null;
  status: "active" | "inactive";
  createdAt: string;

  rating?: number | null;          // average rating (e.g. 4.8)
  totalTrips?: number | null;
}

export interface DriverResponse {
  drivers: Driver[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==========================
// ORDERS
// ==========================
export interface orderItems {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customerId: string;
  driverId: string;
  deliveryDate: string; // ISO string
  items: orderItems[];
paymentMethod?: "cash_on_delivery";
}

// Response types for Get Orders
export interface OrderItemProduct {
  name: string;
  size: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: OrderItemProduct;
}

export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface DriverInfo {
  name: string;
  vehicleId: string;
}

export interface ZoneInfo {
  name: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  orderNumberDisplay: string;
  customerId: string;
  driverId: string;
  zoneId: string;
  deliveryDate: string; // ISO
  deliveryAddress: string;
  totalAmount: number;
  paymentMethod: "cash_on_delivery";
  status: "pending" | "in_progress" | "delivered" | "cancelled";
  tenantId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;

  customer: CustomerInfo;
  driver: DriverInfo;
  zone: ZoneInfo;
  items: OrderItem[];
}

export interface OrderStats {
  totalOrders: number;
  pending: number;
  in_progress: number;
  delivered: number;
  cancelled: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetOrdersResponse {
  orders: Order[];
  stats: OrderStats;
  pagination: PaginationInfo;
}



export interface InventoryResponse {
  totalBottles: number;
  inStock: number;
  withCustomers: number;
  totalActiveBottles: number;
  totalSecurityDeposit: number;
  lowStockAlert: boolean;
  lowStockMessage: string | null;
  bottleStockLevels: BottleStockLevel[];
  recentTransactions: RecentTransaction[];
  emptiesTracking: EmptiesTracking[];
}

export interface BottleStockLevel {
  [key: string]: any;
}

export interface RecentTransaction {
  customerName: string;
  driverName: string;
  date: string;
  bottles: number;
  status: string;
}

export interface EmptiesTracking {
  // Structure unknown for now
  [key: string]: any;
}


export interface CreateInventoryRequest {
  quantity: number;
  [key: string]: any;
}
