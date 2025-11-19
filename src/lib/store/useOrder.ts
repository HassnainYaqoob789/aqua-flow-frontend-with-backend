// useOrderStore.ts
import { createStoreFactory } from "./storeFactory";
import { CreateOrderPayload } from "@/lib/types/auth";


interface OrderState {
  orders: CreateOrderPayload[];
}

export const useOrderStore = createStoreFactory<OrderState>({
  orders: [],
});

export const setOrders = (list: CreateOrderPayload[]) =>
  useOrderStore.getState().setState({ orders: list });

export const addOrder = (order: CreateOrderPayload) =>
  useOrderStore.getState().setState({
    orders: [...useOrderStore.getState().state.orders, order],
  });

export const clearOrders = () => useOrderStore.getState().resetState();
