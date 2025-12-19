// // src/lib/store/useCustomerStore.ts
// import { createStoreFactory } from "./storeFactory";
// import type { Customer } from "@/lib/types/typeInterfaces";

// interface CustomerState {
//   customers: Customer[];
// }

// export const useCustomerStore = createStoreFactory<CustomerState>({
//   customers: [],
// });

// export const setCustomers = (customers: Customer[]) =>
//   useCustomerStore.getState().setState({ customers });

// export const addCustomer = (customer: Customer) => {
//   const { state, setState } = useCustomerStore.getState();
//   setState({
//     customers: [...state.customers, customer],
//   });
// };

// export const update_Customer = (customer: Customer) => {
//   const { state, setState } = useCustomerStore.getState();
//   setState({
//     customers: state.customers.map((c) =>
//       c.id === customer.id ? customer : c
//     ),
//   });
// };

// export const status_Customer = (customer: Customer) => {
//   const { state, setState } = useCustomerStore.getState();
//   setState({
//     customers: state.customers.map((c) =>
//       c.id === customer.id ? customer : c
//     ),
//   });
// };

// export const clearCustomers = () =>
//   useCustomerStore.getState().resetState();
// src/lib/store/useCustomerStore.ts
// src/lib/store/useCustomerStore.ts
import { createStoreFactory } from "./storeFactory";
import type { Customer, CustomerListResponse } from "@/lib/types/typeInterfaces";

interface CustomerState {
  customers: Customer[];
  counts: CustomerListResponse["counts"];
}

const initialState: CustomerState = {
  customers: [],
  counts: {
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
  },
};

export const useCustomerStore = createStoreFactory<CustomerState>(initialState);

// Sync full page response into store
export const setCustomers = (data: CustomerListResponse) => {
  useCustomerStore.getState().setState({
    customers: data.customers,
    counts: data.counts,
  });
};

// Keep the exact export names you were already importing elsewhere
export const addCustomer = (customer: Customer) => {
  useCustomerStore.getState().setState((state) => ({
    customers: [...state.customers, customer],
  }));
};

export const update_Customer = (customer: Customer) => {
  useCustomerStore.getState().setState((state) => ({
    customers: state.customers.map((c) =>
      c.id === customer.id ? customer : c
    ),
  }));
};

export const status_Customer = (customer: Customer) => {
  useCustomerStore.getState().setState((state) => ({
    customers: state.customers.map((c) =>
      c.id === customer.id ? customer : c
    ),
  }));
};

// lib/store/useCustomerStore.ts

export const setCustomersPage = (data: CustomerListResponse) => {
  useCustomerStore.getState().setState((state) => ({
    customers: [...state.customers, ...data.customers],
    counts: data.counts, // latest counts
  }));
};

export const setCustomersSearch = (data: CustomerListResponse) => {
  useCustomerStore.getState().setState({
    customers: data.customers,
    counts: data.counts,
  });
};

export const clearCustomers = () =>
  useCustomerStore.getState().setState({
    customers: [],
    counts: { totalCustomers: 0, activeCustomers: 0, inactiveCustomers: 0 },
  });

// export const clearCustomers = () =>
//   useCustomerStore.getState().resetState();