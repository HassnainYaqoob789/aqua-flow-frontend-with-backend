import { CUSTOMER_CREATE_URL, CUSTOMER_GET_URL, CUSTOMER_PATCH_URL, CUSTOMER_PUT_URL, LOGIN_URL, ZONE_CREATE_URL, ZONE_GET_URL, PRODUCTS_CREATE_URL, PRODUCTS_GET_URL } from "./services/endpoints";
import apiClient from "./services/apiClient";
import { Customer, LoginResponse, LoginRequest, Zone, Product, ProductResponse } from "@/lib/types/auth";
import { apiGet, apiPatch, apiPost, apiPut } from "./services/apiMethods";






export const loginUser = (payload: LoginRequest) =>
  apiPost<LoginResponse>(LOGIN_URL, payload);


// =========================CUSTOMER APIS=========================

export const getCustomers = async (): Promise<Customer[]> => {
  return await apiGet<Customer[]>(CUSTOMER_GET_URL);
};

export const createCustomer = async (
  body: Partial<Customer>
): Promise<Customer> => {
  return await apiPost<Customer>(CUSTOMER_CREATE_URL, body);
};




export const updateCustomer = async (
  body: Partial<Customer>
): Promise<Customer> => {
  return await apiPut<Customer>(CUSTOMER_PUT_URL, body);
};


export const statusCustomer = async (
  body: Partial<Customer>
): Promise<Customer> => {
  return await apiPatch<Customer>(CUSTOMER_PATCH_URL, body);
};
// =========================CUSTOMER APIS END=========================

// =========================ZONE APIS=========================


export const createZone = async (
  body: Partial<Zone>
): Promise<Zone> => {
  return await apiPost<Zone>(ZONE_CREATE_URL, body);
};

export const getZones = async (): Promise<Zone[]> => {
  return await apiGet<Zone[]>(ZONE_GET_URL);
};




// =========================ZONE APIS END=========================





// =========================PRODUCTS APIS=========================


export const createProducts = async (
  body: Partial<Product>
): Promise<Product> => {
  return await apiPost<Product>(PRODUCTS_CREATE_URL, body);
};


export const getProducts = async (): Promise<ProductResponse[]> => {
  return await apiGet<ProductResponse[]>(PRODUCTS_GET_URL);
};




// =========================PRODUCTS APIS END=========================






