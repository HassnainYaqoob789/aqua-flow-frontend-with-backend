// src/lib/config.ts

// export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.18.107:8001/api";
// export const IMG_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.18.107:8001";

// export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://aquaflow.alisonstech-dev.com/api";
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://aquaflow.alisonstech-dev.com/backend/api";
export const IMG_URL = process.env.NEXT_PUBLIC_API_URL || "https://aquaflow.alisonstech-dev.com/backend";


export const LOGIN_URL = `${BASE_URL}/auth/login`;


// ====================CUSTOMER APIS=========================

export const CUSTOMER_CREATE_URL = `${BASE_URL}/customers/create`;
export const CUSTOMER_GET_URL = `${BASE_URL}/customers/all`;
export const CUSTOMER_PUT_URL = `${BASE_URL}/customers/update`;
export const CUSTOMER_PATCH_URL = `${BASE_URL}/customers/status`;

// ====================CUSTOMER APIS=========================


// ==========================ZONE API ======================
export const ZONE_CREATE_URL = `${BASE_URL}/zones/create`;
export const ZONE_GET_URL = `${BASE_URL}/zones/all`;
// ==========================ZONE API ======================

// ==========================PRODUCTS API ======================

export const PRODUCTS_CREATE_URL = `${BASE_URL}/products/create`;

export const PRODUCTS_GET_URL = `${BASE_URL}/products/all`;
// ==========================PRODUCTS API END ======================


// ==========================DRIVER API ======================


export const DRIVER_CREATE_URL = `${BASE_URL}/drivers/create`;
export const DRIVER_GET_URL = `${BASE_URL}/drivers/all`;




// ==========================DRIVER API ======================





// ==========================ORDER API ======================


export const ORDER_CREATE_URL = `${BASE_URL}/orders/create`;
export const ORDER_GET_URL = `${BASE_URL}/orders/all`;




// ==========================ORDER API ======================

