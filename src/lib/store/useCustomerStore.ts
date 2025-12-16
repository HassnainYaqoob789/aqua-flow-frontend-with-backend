// src/lib/store/useCustomerStore.ts
import { createStoreFactory } from "./storeFactory";
import type { Customer } from "@/lib/types/typeInterfaces";

interface CustomerState {
  customers: Customer[];
}

export const useCustomerStore = createStoreFactory<CustomerState>({
  customers: [],
});

export const setCustomers = (customers: Customer[]) =>
  useCustomerStore.getState().setState({ customers });

export const addCustomer = (customer: Customer) => {
  const { state, setState } = useCustomerStore.getState();
  setState({
    customers: [...state.customers, customer],
  });
};

export const update_Customer = (customer: Customer) => {
  const { state, setState } = useCustomerStore.getState();
  setState({
    customers: state.customers.map((c) =>
      c.id === customer.id ? customer : c
    ),
  });
};

export const status_Customer = (customer: Customer) => {
  const { state, setState } = useCustomerStore.getState();
  setState({
    customers: state.customers.map((c) =>
      c.id === customer.id ? customer : c
    ),
  });
};

export const clearCustomers = () =>
  useCustomerStore.getState().resetState();
