// src/lib/config.ts

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.18.107:8001/api";
export const IMG_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.18.107:8001";

// export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://aquaflow.alisonstech-dev.com/api";
// export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://aquaflow.alisonstech-dev.com/backend/api";
// export const IMG_URL = process.env.NEXT_PUBLIC_API_URL || "https://aquaflow.alisonstech-dev.com/backend";

export const LOGIN_URL = `${BASE_URL}/auth/login`;

// ====================CUSTOMER APIS=========================
export const CUSTOMER_CREATE_URL = `${BASE_URL}/admin/customers/create`;
export const CUSTOMER_GET_URL = `${BASE_URL}/admin/customers/all`;
export const CUSTOMER_PUT_URL = `${BASE_URL}/admin/customers/update`;
export const CUSTOMER_PATCH_URL = `${BASE_URL}/admin/customers/status`;
// ====================CUSTOMER APIS=========================

// ==========================ZONE API ======================
export const ZONE_CREATE_URL = `${BASE_URL}/zones/create`;
export const ZONE_GET_URL = `${BASE_URL}/zones/all`;
export const ZONE_PUT_URL = `${BASE_URL}/zones/update`;
export const ZONE_DELETE_URL = `${BASE_URL}/zones/delete/`;

export const CUSTOMER_BY_ZONE_GET_URL = `${BASE_URL}/delivery-operations/customers-by-zone`;
// ==========================ZONE API ======================

// ==========================PRODUCTS API ======================
export const PRODUCTS_CREATE_URL = `${BASE_URL}/products/create`;
export const PRODUCTS_GET_URL = `${BASE_URL}/products/all`;
export const PRODUCTS_PUT_URL = `${BASE_URL}/products/update`;
export const PRODUCTS_PATCH_URL = `${BASE_URL}/products/status`;



// ==========================PRODUCTS API END ======================

// ==========================DRIVER API ======================
export const DRIVER_CREATE_URL = `${BASE_URL}/admin/drivers/create`;
export const DRIVER_GET_URL = `${BASE_URL}/admin/drivers/all`;
export const DRIVER_PUT_URL = `${BASE_URL}/admin/drivers/update`;
export const DRIVER_PATCH_URL = `${BASE_URL}/admin/drivers/status`;


export const DRIVER_PATCH_ASSIGN_URL = `${BASE_URL}/delivery-operations/assign-driver`;
export const BULK_ASSIGN_DRIVER_URL = `${BASE_URL}/delivery-operations/assign-driver`;
// ==========================DRIVER API ======================
// ==========================ORDER API ======================
export const ORDER_CREATE_URL = `${BASE_URL}/orders/create`;
export const ORDER_GET_URL = `${BASE_URL}/orders/all`;
// ==========================ORDER API ======================

// ==========================INVENTORY API ======================
export const INVENTORY_GET_URL = `${BASE_URL}/inventory/dashboard`;
export const INVENTORY_CREATE_URL = `${BASE_URL}/inventory/add-stock`;
// ==========================INVENTORY API ======================

// =============================== USERS API =============================
export const USERS_CREATE_URL = `${BASE_URL}/users/create`;
export const USERS_GET_URL = `${BASE_URL}/users/all`;



// =============================== USERS API END =============================








