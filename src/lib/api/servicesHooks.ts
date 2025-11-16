import { createQueryFactory, createMutationFactory } from "@/lib/api/queryFactory";
import { loginUser, getCustomers, createCustomer,updateCustomer,statusCustomer,createZone,getZones,createProducts,getProducts } from "./apiFactory";
import { setCustomers, addCustomer,update_Customer,status_Customer } from "../store/useCustomerStore";
import { addZone, setZone} from "../store/useZoneStore";
import { addProducts,setProducts} from "../store/useProduct";




import { setAuth } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import { Customer, StatusPayload } from "../types/auth";

export const useLogin = () => {
  const router = useRouter();
  
  return createMutationFactory("auth", loginUser, (data) => {
    setAuth(data);
    router.push("/"); 
  })();
};

// ================================CUSTOMER HOOKS=========================

export const useCustomers = createQueryFactory("customers", async () => {
  const data = await getCustomers();
  setCustomers(data);
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



export const useZone = createQueryFactory("zone", async () => {
  const data = await getZones();
  setZone(data); 
  return data;
});

export const useCreateZone = createMutationFactory(
  "zone",
  createZone,
  (data) => addZone(data)
);






// =============================================ZONE HOOKS=========================




export const useCreateProducts = createMutationFactory(
  "products",
  createProducts,
  (data) => addProducts(data)
);



export const useProducts = createQueryFactory("products", async () => {
  const data = await getProducts();
  setProducts(data);
  return data;
});






