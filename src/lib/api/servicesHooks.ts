import { createQueryFactory, createMutationFactory } from "@/lib/api/queryFactory";
import { loginUser, getCustomers, createCustomer, updateCustomer, statusCustomer, createZone, getZones, createProducts, getProducts, createDriver, getDrivers, createOrder, getOrders, createProductWithImage, getInventory, createInventory } from "./apiFactory";
import { setCustomers, addCustomer, update_Customer, status_Customer } from "../store/useCustomerStore";
import { addZone, setZone } from "../store/useZoneStore";
import { addProducts, setProducts } from "../store/useProduct";




import { setAuth } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import { Customer, Product, StatusPayload } from "../types/auth";
import { addDriver, setDrivers } from "../store/useDriver";
import { addOrder, setOrders } from "../store/useOrder";
import { setInventory, updateInventory } from "../store/inventoryStore";

export const useLogin = () => {
  const router = useRouter();

  return createMutationFactory("auth", loginUser, (data) => {
    setAuth(data);
    router.replace("/");
  })();
};

// ================================CUSTOMER HOOKS=========================

export const useCustomers = createQueryFactory("customers", async () => {
  const data = await getCustomers();
  setCustomers(data.customers);
  return data;
});

export const useCreateCustomer = createMutationFactory(
  "customers",
  createCustomer,
  (data) => addCustomer(data)
);

export const useUpdateCustomer = createMutationFactory(
  "customers",
  updateCustomer,
  (data) => update_Customer(data)
);


export const useStatusCustomer = createMutationFactory<Customer, StatusPayload>(
  "customers",
  statusCustomer,
  (data) => status_Customer(data)
);


// ================================CUSTOMER HOOKS=========================
// ================================ZONE HOOKS=========================



// src/lib/api/servicesHooks.ts (or wherever your hooks are)

export const useZone = createQueryFactory("zones", async () => {
  const response = await getZones(); // returns ZoneResponse
  return response; // ← return FULL response, not just .zones
});

export const useCreateZone = createMutationFactory(
  "zone",
  createZone,
  (data) => addZone(data)
);






// =============================================ZONE HOOKS=========================


// =============================================PRODUCTS HOOKS=========================


export const useCreateProducts = createMutationFactory<Product, FormData>(  // ← FormData here
  "products",
  createProductWithImage,  // ← now matches
  (data) => addProducts(data)
);



export const useProducts = createQueryFactory("products", async () => {
  const data = await getProducts(); // now returns ProductResponse (single object)
  setProducts(data); // this expects ProductResponse, which has .products
  return data;
});


// =============================================PRODUCTS HOOKS END=========================



// =============================================DRIVER HOOKS=========================

export const useCreateDriver = createMutationFactory(
  "drivers",
  createDriver,
  (data) => addDriver(data)
);

export const useDriver = createQueryFactory("drivers", async () => {
  const data = await getDrivers();
  setDrivers(data.drivers);
  return data;
});

// =============================================DRIVER HOOKS END=========================


// =============================================ORDERS HOOKS=========================

export const useCreateOrder = createMutationFactory(
  "orders",
  createOrder,
  (data) => addOrder(data)
);





export const useOrderStore = createQueryFactory("orders", async () => {
  const data = await getOrders();
  setOrders(data.orders);
  return data;
});



// =============================================ORDERS HOOKS API=========================




// =============================================INVENTORY HOOKS API=========================



export const useInventoryStore = createQueryFactory("inventory", async () => {
  const data = await getInventory();
  setInventory(data); // <-- correct line
  return data;
});


export const useCreateInventory = createMutationFactory(
  "inventory",
  createInventory,
  (data) => updateInventory(data) // since it's a partial patch
);










// =============================================INVENTORY HOOKS API=========================






