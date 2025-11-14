
import { createStoreFactory } from "./storeFactory";
import Cookies from "js-cookie";
import { LoginResponse } from "@/lib/types/auth";

interface AuthState {
  user: LoginResponse["user"] | null;
  token: string | null;
}

export const useAuthStore = createStoreFactory<AuthState & { logout: () => void }>({
  user: null,
  token: null,
  logout: () => {
    Cookies.remove("token");
    useAuthStore.getState().resetState();
  },
});
// export const setAuth = (data: LoginResponse) => {
//   Cookies.set("token", data.token, { expires: 7 });
//   useAuthStore.getState().setState({
//     user: data.user,
//     token: data.token,
//   });
// };

export const setAuth = (data: LoginResponse) => {
  // Save token separately
  Cookies.set("token", data.token, { expires: 7 });

  // Save user object as JSON string
  Cookies.set("user", JSON.stringify(data.user), { expires: 7 });

  // Update Zustand state
  useAuthStore.getState().setState({
    user: data.user,
    token: data.token,
  });
};

export const logout = () => {
 Cookies.remove("token");
    Cookies.remove("user");
    useAuthStore.getState().resetState();
};
