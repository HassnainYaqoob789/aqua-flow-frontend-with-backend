// src/lib/query/queryFactory.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function createQueryFactory<TData>(key: string, fetchFn: () => Promise<TData>) {
  return () =>
    useQuery<TData>({
      queryKey: [key],
      queryFn: fetchFn,
    });
}

export function createMutationFactory<TData, TVariables>(
  key: string,
  mutationFn: (payload: TVariables) => Promise<TData>,
  onSuccess?: (data: TData) => void
) {
  return () => {
    const qc = useQueryClient();

    return useMutation<TData, Error, TVariables>({
      mutationFn,
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: [key] });
        if (onSuccess) onSuccess(data);
      },
    });
  };
}


export function createQueryFactoryWithParams<TData, TVariables>(
  key: string,
  fetchFn: (variables: TVariables) => Promise<TData>
) {
  return (variables: TVariables) =>
    useQuery<TData>({
      queryKey: [key, variables],
      queryFn: () => fetchFn(variables),
      enabled: !!variables, // only fetch when zoneId exists
    });
}

