import { createQueryFactory, createMutationFactory, createQueryFactoryWithParams } from "@/lib/api/queryFactory";
import { loginUser, getCustomers, createCustomer, updateCustomer, statusCustomer, createZone, getZones, createProducts, getProducts, createDriver, getDrivers, createOrder, getOrders, createProductWithImage, getInventory, createInventory, getCustomerByZone, bulkAssignDriver, assignDriver, updateZone, deleteZone, updateDriver, createUser, getUsers, updateProducts, statusProduct, statusUpdateDriver, statusZone, getReports, getUsersStats, getOrdersPaginated } from "./apiFactory";
import { setCustomers, addCustomer, update_Customer, status_Customer } from "../store/useCustomerStore";
import { addZone, delete_Zone, setZone, status_Zone, update_Zone } from "../store/useZoneStore";
import { addProducts, setProducts, status_Product, update_Products } from "../store/useProduct";




import { setAuth } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import { AssignDriverPayload, BulkAssignPayload, CreateOrderPayload, Customer, CustomerListResponse, CustomersByZoneResponse, Driver, GetOrdersResponse, Order, Product, StatusPayload, StatusPayloadDriver, ToastContextType, Zone } from "../types/auth";
import { addDriver, setDrivers, status_Driver, status_update_Driver, update_Driver, useDriverStore } from "../store/useDriver";
import {
  // addOrder,
  setOrders, updateOrder
} from "../store/useOrder";
import { setInventory, updateInventory } from "../store/inventoryStore";
import { useToastStore } from '../store/toastStore';
import { addUser, setUsers, setUsersStats } from "../store/useUserStore";
import { setReports } from "../store/reportsStore";

export const useLogin = () => {
  const router = useRouter();

  return createMutationFactory("auth", loginUser, (data) => {
    console.log("🔥 Login API Response:", data);
    setAuth(data);
    setTimeout(() => {
      router.replace("/");
    }, 500);
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


export const useUpdateZone = createMutationFactory(
  "zones",
  updateZone,
  (data) => update_Zone(data)
);


export const useDeleteZone = createMutationFactory<Zone, string>(
  "zones",
  deleteZone,
  (data) => delete_Zone(data)
);


export const useStatusZone = createMutationFactory<Zone, StatusPayload>(
  "zones",
  statusZone,
  (data) => status_Zone(data)
);



// Update the hook (e.g., in src/lib/api/servicesHooks.ts)
export const useCustomerByZone = createQueryFactoryWithParams<
  CustomersByZoneResponse,
  string
>("customers-by-zone", getCustomerByZone);





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


export const useUpdateProducts = createMutationFactory(
  "products",
  updateProducts,
  (data) => update_Products(data)
);



export const useStatusProduct = createMutationFactory<Product, StatusPayload>(
  "products",
  statusProduct,
  (data) => status_Product(data)
);

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


export const useUpdateDriver = createMutationFactory(
  "driver",
  updateDriver,
  (data) => update_Driver(data)
);


export const useStatusUpdateDriver = createMutationFactory<Driver, StatusPayload>(
  "drivers",
  statusUpdateDriver,
  (data) => status_update_Driver(data)
);


// export const useStatusDriver =
//   createMutationFactory<Driver, StatusPayloadDriver>(
//     "drivers",
//     statusDriver,
//     (data) => status_Driver(data)
//   );




// =============================================DRIVER HOOKS END=========================


// =============================================ORDERS HOOKS=========================

// export const useCreateOrder = createMutationFactory(
//   "orders",
//   createOrder,
//   (data) => addOrder(data)
// );
export const useCreateOrder = createMutationFactory<Order, Partial<CreateOrderPayload>>(
  "orders",
  createOrder
  // Remove the third parameter completely
  // No onSuccess callback needed here — the factory already invalidates!
);




export const useOrderStore = createQueryFactory("orders", async () => {
  const data = await getOrders();
  setOrders(data.orders);
  return data;
});

export const useOrdersQuery = createQueryFactoryWithParams<
  GetOrdersResponse,
  { page: number; limit: number }
>("orders", getOrdersPaginated);
export const useOrderStatsStore = createQueryFactory("ordersStats", async () => {
});





export const useAssignDriver = (options?: {
  onSuccess?: (data: Order) => void;
  onError?: (error: any) => void;
}) => {
  const mutation = createMutationFactory<Order, AssignDriverPayload>(
    "orders/assign-driver",
    assignDriver,
    (data) => {
      updateOrder(data);
      options?.onSuccess?.(data);
    }
  );

  return mutation;
};




export const useBulkAssignDriver = createMutationFactory<any, BulkAssignPayload>(
  "bulk-assign-driver",
  bulkAssignDriver,
  (data) => {
    console.log('onSuccess in mutation factory:', data);
  }
);
// // =============================================ORDERS HOOKS API=========================




// =============================================INVENTORY HOOKS API=========================



export const useInventoryStore = createQueryFactory("inventory", async () => {
  const data = await getInventory();
  setInventory(data); // <-- correct line
  return data;
});

export const useCreateInventory = createMutationFactory(
  "inventory",
  createInventory,
  (data) => updateInventory(data) // data now matches Partial<InventoryResponse>
);
// =============================================INVENTORY HOOKS API=========================



// ===========================================USER HOOKS API=============================
export const useCreateUser = createMutationFactory(
  "users",
  createUser,
  (data) => addUser(data.user)
);

export const useUsers = createQueryFactory("users", async () => {
  const data = await getUsers();
  setUsers(data.users); // ✅ sets store properly
  return data;
});




export const useUsersStats = createQueryFactory("usersStats", async () => {
  const data = await getUsersStats();

  setUsersStats(data);
});



// ============================================USER HOOK API==================================




export const useReportStore = createQueryFactory("reports", async () => {
  const data = await getReports();
  setReports(data);
  return data;
});
