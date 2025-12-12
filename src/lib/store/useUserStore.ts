// src/lib/store/useUserStore.ts
import { createStoreFactory } from "./storeFactory";
import type { User } from "@/lib/types/auth";

interface UserState {
  users: User[];
  usersStats: any;
}

export const useUserStore = createStoreFactory<UserState>({
  users: [],
  usersStats:[],
});

export const setUsers = (users: User[]) =>
  useUserStore.getState().setState({ users });

export const addUser = (user: User) => {
  const { state, setState } = useUserStore.getState();
  setState({ users: [...state.users, user] });
};

export const setUsersStats = (usersStats : any) => { 
  useUserStore.getState().setState({ usersStats });
}

export const updateUser = (user: User) => {
  const { state, setState } = useUserStore.getState();
  setState({
    users: state.users.map((u) => (u.id === user.id ? user : u)),
  });
};

export const clearUsers = () =>
  useUserStore.getState().resetState();
