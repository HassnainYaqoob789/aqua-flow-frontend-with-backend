import apiClient from "./apiClient";

export const apiGet = async <T>(url: string): Promise<T> => {
  const { data } = await apiClient.get<T>(url);
  return data;
};

export const apiPost = async <T>(url: string, body?: any): Promise<T> => {
  const { data } = await apiClient.post<T>(url, body);
  return data;
};

export const apiPut = async <T>(url: string, body?: any): Promise<T> => {
  const { data } = await apiClient.put<T>(url, body);
  return data;
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  const { data } = await apiClient.delete<T>(url);
  return data;
};


export const apiPatch = async <T>(url: string, body?: any): Promise<T> => {
  const { data } = await apiClient.patch<T>(url, body);
  return data;
};
