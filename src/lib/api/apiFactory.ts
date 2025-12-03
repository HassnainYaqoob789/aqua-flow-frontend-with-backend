// apiFactory.ts

import {
  Customer,
  CustomerListResponse,
  Zone,
  Product,
  ProductResponse,
  LoginRequest,
  LoginResponse,
  StatusPayload,
  Driver,
  DriverResponse,
  CreateOrderPayload,
  GetOrdersResponse,
  ZoneResponse,
  InventoryResponse,
  CreateInventoryRequest,
  StatusPayloadDriver,
  AssignDriverPayload,
  Order,
  BulkAssignPayload,
  CustomersByZoneResponse,
  User,
  GetUsersResponse,
  CreateUserResponse,
} from "@/lib/types/auth";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./services/apiMethods";
import {
  CUSTOMER_CREATE_URL,
  CUSTOMER_GET_URL,
  CUSTOMER_PATCH_URL,
  CUSTOMER_PUT_URL,
  LOGIN_URL,
  ZONE_CREATE_URL,
  ZONE_GET_URL,
  PRODUCTS_CREATE_URL,
  PRODUCTS_GET_URL,
  DRIVER_CREATE_URL,
  DRIVER_GET_URL,
  ORDER_CREATE_URL,
  ORDER_GET_URL,
  INVENTORY_GET_URL,
  INVENTORY_CREATE_URL,
  CUSTOMER_BY_ZONE_GET_URL,
  BULK_ASSIGN_DRIVER_URL,
  DRIVER_PATCH_ASSIGN_URL,
  ZONE_PUT_URL,
  ZONE_DELETE_URL,
  DRIVER_PUT_URL,
  USERS_CREATE_URL,
  USERS_GET_URL,
  PRODUCTS_PUT_URL,
  PRODUCTS_PATCH_URL,
  DRIVER_PATCH_URL,
} from "./services/endpoints";
import apiClient from "./services/apiClient";
import { useDriverStore } from "../store/useDriver";

export const loginUser = (payload: LoginRequest) =>
  apiPost<LoginResponse>(LOGIN_URL, payload);

// =========================CUSTOMER APIS=========================
// Return full list response
export const getCustomers = async (): Promise<CustomerListResponse> => {
  return await apiGet<CustomerListResponse>(CUSTOMER_GET_URL);
};
export const createCustomer = async (
  body: Partial<Customer> & { password?: string } // if backend accepts password
): Promise<Customer> => {
  return await apiPost<Customer>(CUSTOMER_CREATE_URL, body);
};
export const updateCustomer = async (
  payload: Partial<Customer> & { id: string }
): Promise<Customer> => {
  const { id, ...rest } = payload;
  return await apiPut<Customer>(`${CUSTOMER_PUT_URL}/${id}`, rest);
};
export const statusCustomer = async (
  payload: StatusPayload
): Promise<Customer> => {
  const { id, status } = payload;
  return await apiPatch<Customer>(`${CUSTOMER_PATCH_URL}/${id}`, { status });
};
// =========================CUSTOMER APIS END=========================

// =========================ZONE APIS=========================
export const createZone = async (
  body: Partial<Zone>
): Promise<Zone> => {
  return await apiPost<Zone>(ZONE_CREATE_URL, body);
};
export const getZones = async (): Promise<ZoneResponse> => {
  return await apiGet<ZoneResponse>(ZONE_GET_URL);
};
export const updateZone = async (
  payload: Partial<Zone> & { id: string }
): Promise<Zone> => {
  const { id, ...rest } = payload;
  return await apiPut<Zone>(`${ZONE_PUT_URL}/${id}`, rest);
};
export const deleteZone = async (
  id: string
): Promise<Zone> => {
  return await apiDelete<Zone>(`${ZONE_DELETE_URL}${id}`);
};
export const assignDriver = async (
  payload: AssignDriverPayload
): Promise<Order> => {
  const { orderId, driverId } = payload;
  return await apiPatch<Order>(`${DRIVER_PATCH_ASSIGN_URL}/${orderId}`, { driverId });
};
export const getCustomerByZone = async (zoneId: string): Promise<CustomersByZoneResponse> => {
  return await apiGet<CustomersByZoneResponse>(
    `${CUSTOMER_BY_ZONE_GET_URL}/${zoneId}`
  );
};
// =========================ZONE APIS END=========================

// =========================PRODUCTS APIS=========================
export const createProducts = async (
  body: Partial<Product>
): Promise<Product> => {
  return await apiPost<Product>(PRODUCTS_CREATE_URL, body);
};

export const createProductWithImage = async (formData: FormData): Promise<Product> => {
  const { data } = await apiClient.post<Product>(PRODUCTS_CREATE_URL, formData);
  return data;
};

export const getProducts = async (): Promise<ProductResponse> => {
  return await apiGet<ProductResponse>(PRODUCTS_GET_URL);
};

export const updateProducts = async (
  payload: Partial<Product> & { id: string }
): Promise<Product> => {
  const { id, ...rest } = payload;
  return await apiPut<Product>(`${PRODUCTS_PUT_URL}/${id}`, rest);
};
export const statusProduct = async (
  payload: StatusPayload
): Promise<Product> => {
  const { id, status } = payload;
  return await apiPatch<Product>(`${PRODUCTS_PATCH_URL}/${id}`, { status });
};

// =========================PRODUCTS APIS END=========================

// ==================================DRIVER APIS============================
export const createDriver = async (
  body: Partial<Driver>
): Promise<Driver> => {
  return await apiPost<Driver>(DRIVER_CREATE_URL, body);
};

export const getDrivers = async (): Promise<DriverResponse> => {
  return await apiGet<DriverResponse>(DRIVER_GET_URL);
};

export const updateDriver = async (
  payload: Partial<Driver> & { id: string }
): Promise<Driver> => {
  const { id, ...rest } = payload;
  return await apiPut<Driver>(`${DRIVER_PUT_URL}/${id}`, rest);
};

export const statusUpdateDriver = async (
  payload: StatusPayload
): Promise<Driver> => {
  const { id, status } = payload;
  return await apiPatch<Driver>(`${DRIVER_PATCH_URL}/${id}`, { status });
};

// ============================================================================================================

export const bulkAssignDriver = async (
  payload: BulkAssignPayload
): Promise<any> => {
  console.log('bulkAssignDriver called with payload:', payload); // Debug log
  try {
    const response = await apiPost(BULK_ASSIGN_DRIVER_URL, payload);
    console.log('API response:', response); // Debug log
    return response;
  } catch (error) {
    console.error('API error in bulkAssignDriver:', error); // Debug log
    throw error;
  }
};

export const statusDriver = async (
  payload: StatusPayloadDriver
): Promise<Driver> => {
  const { id, status } = payload;
  return await apiPatch<Driver>(`${DRIVER_PATCH_ASSIGN_URL}/${id}`, { status });
};


// =================================DRIVER APIS END================================

// ==================================ORDER APIS============================
export const createOrder = async (
  body: Partial<CreateOrderPayload>
): Promise<Order> => {
  return await apiPost<Order>(ORDER_CREATE_URL, body);
};

export const getOrders = async (): Promise<GetOrdersResponse> => {
  return await apiGet<GetOrdersResponse>(ORDER_GET_URL);
};
// ==================================ORDER APIS END============================

// ==================================INVENTORY APIS============================
export const getInventory = async (): Promise<InventoryResponse> => {
  return await apiGet<InventoryResponse>(INVENTORY_GET_URL);
};

export const createInventory = async (
  body: Partial<CreateInventoryRequest>
): Promise<Partial<InventoryResponse>> => {
  return await apiPost<Partial<InventoryResponse>>(INVENTORY_CREATE_URL, body);
};
// ==================================INVENTORY APIS============================

// ====================================USERS APIS=====================================
export const createUser = async (
  body: Partial<CreateUserResponse> & { password?: string }
): Promise<CreateUserResponse> => {
  return await apiPost<CreateUserResponse>(USERS_CREATE_URL, body);
};

export const getUsers = async (): Promise<GetUsersResponse> => {
  return await apiGet<GetUsersResponse>(USERS_GET_URL);
};



// =======================================USERS APIS END==================================
