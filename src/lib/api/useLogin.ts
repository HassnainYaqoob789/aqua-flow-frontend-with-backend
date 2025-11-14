// import { useMutation } from "@tanstack/react-query";
// import { loginUser } from "./apiFactory";
// import { useAuthStore } from "../store/useAuthStore";
// import { useRouter } from "next/navigation";

// export const useLogin = () => {
// const router = useRouter();

//   const setAuth = useAuthStore((s) => s.setAuth);

//   return useMutation({
//     mutationFn: loginUser,
//     onSuccess: (data) => {
//       console.log("Login response:", data);
//       setAuth(data);
//       router.push("/");
//     },
//     onError: (error: any) => {
//       console.error("Login failed:", error.response?.data || error.message);
//     },
//   });
// };




