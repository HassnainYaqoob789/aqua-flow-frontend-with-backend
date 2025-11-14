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
