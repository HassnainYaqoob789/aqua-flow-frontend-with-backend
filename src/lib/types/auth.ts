// ==========================
// AUTH
// ==========================
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ToastContextType {
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}
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

// Add these new interfaces to your types file (e.g., src/lib/types/auth.ts or a dedicated delivery.ts)
// Place them in a new section, e.g., // ==========================
// DELIVERY OPERATIONS
// ==========================

export interface PendingOrder {
  id: string;
  number: string;
  amount: number;
}

export interface EligibleCustomer {
  id: string;
  name: string;
  phone: string;
  address: string;
  empties: number;
  deliverableBottles: number;
  pendingOrdersCount: number;
  totalPendingAmount: number;
  pendingOrders: PendingOrder[];
  lastDelivery: string;
  nextEligible: string;
  eligibleToday: boolean;
}

export interface CustomersByZoneResponse {
  success: boolean;
  zone: string;
  totalEligible: number;
  asOf: string;
  customers: EligibleCustomer[];
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
// lib/types/auth.ts (update the Product interface)
export interface Product {
  id: string;
  name: string;
  size: string;
  category: "water" | "milk"; // Add this field
  price: number;
  description?: string;
  image?: string;
  status: "active" | "inactive";
  createdAt: string;
  isReusable?: boolean;
  depositAmount?: number;
  requiresEmptyReturn?: boolean; // Add this field
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
  status: "active" | "inactive"; // <-- THIS is good
  createdAt: string;

  rating?: number | null;
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


export interface StatusPayloadDriver {
  id: string;
  status: Driver["status"]; // "active" | "inactive"
}


// ==========================
// ORDERS
export interface FormOrderItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
  depositAmount: number;
}


export interface CreateOrderPayload {
  customerId: string;
  driverId?: string;
  deliveryDate: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  paymentMethod?: "cash_on_delivery";
  acceptableDepositAmount?: number;
  withBottles?: boolean;
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

export interface BulkAssignPayload {
  zoneId: string;
  driverId: string;
  scheduledDate: string;
  customerIds: string[];
}


export interface AssignDriverPayload {
  orderId: string;
  driverId: string | null;
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
  lastWeekOrders: number;
  newOrderPercentage: number;

  pending: number;
  in_progress: number;
  delivered: number;
  completed: number;
  cancelled: number;
  failed: number;

  recurring: number;
  oneTime: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetOrdersResponse {
  orders: Order[];
  pagination: PaginationInfo;
}
export interface GlobalReusablePool {
  totalPurchased: number;
  inStock: number;
  withCustomers: number;
  damaged: number;
  lost: number;
  repairable: number;
  leaked: number;
}
export interface ProductInventory {
  currentStock: number;
  totalAdded: number;
  totalSold: number;
  product: Product;
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
  emptiesTracking: EmptiesTracking[]; // Update type
  productInventories: ProductInventory[]; // Add this
  globalReusablePool: GlobalReusablePool; // Add this
}
export interface EmptiesTrackingItem {
  customerName: string;
  lastReturn: string;
  pendingReturn: number;
  securityDeposit: number;
}

export interface BottleStockLevel {
  productName: string;
  size: string;
  available: number;
  isLow: boolean;
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


export type UserRole = "company_user" | "company_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  // optional fields
  password?: string;
  address?: string | null;
  logo?: string | null;
  otp?: string | null;
  tenantId?: string;
  lastActivity?: string;
  updatedAt?: string;
}
export interface CreateUserResponse {
  message: string;
  user: User;
}

export interface GetUsersResponse {
  users: User[];
}

export interface GetUsersStatsResponse {
  totalCount: number;
  recentUsersCount: number;
  recentUsersPercentage: number;
}

export interface ReportsState {
  reports: any | null;
}
