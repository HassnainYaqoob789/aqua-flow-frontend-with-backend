// useProductStore.ts
import { createStoreFactory } from "./storeFactory";
import { Product, ProductResponse } from "@/lib/types/auth";

interface ProductState {
  products: Product[];
}

export const useProductStore = createStoreFactory<ProductState>({
  products: [],
});

export const setProducts = (response: ProductResponse) =>
  useProductStore.getState().setState({ products: response.products });

export const addProducts = (product: Product) =>
  useProductStore.getState().setState({
    products: [...useProductStore.getState().state.products, product],
  });

  export const update_Products = (product: Product) => {
    const { state, setState } = useProductStore.getState();
    setState({
      products: state.products.map((c) =>
        c.id === product.id ? product : c
      ),
    });
  };

  export const status_Product = (product: Product) => {
    const { state, setState } = useProductStore.getState();
    setState({
      products: state.products.map((c) =>
        c.id === product.id ? product : c
      ),
    });
  };

export const clearProducts = () =>
  useProductStore.getState().resetState();
