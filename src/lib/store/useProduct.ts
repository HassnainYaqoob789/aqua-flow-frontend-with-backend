import { createStoreFactory } from "./storeFactory";
import { Product, ProductResponse } from "@/lib/types/auth";

interface ProductState {
  products: Product[];
}

export const useProductStore = createStoreFactory<ProductState>({
  products: [],
});

export const setProducts = (ProductResponse: ProductResponse[]) =>
  useProductStore.getState().setState({ products });

export const addProducts = (product: Product) =>
  useProductStore.getState().setState({
    products: [...useProductStore.getState().state.products, product],
  });





export const clearProducts = () =>
  useProductStore.getState().resetState();
