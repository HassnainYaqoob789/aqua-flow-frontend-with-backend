// // lib/api/useInfiniteCustomers.ts
// import { useEffect, useState } from "react";
// import { useCustomers } from "@/lib/api/servicesHooks";
// import { useCustomerStore, setCustomers } from "@/lib/store/useCustomerStore";
// import { Customer } from "@/lib/types/typeInterfaces";

// export function useInfiniteCustomers(searchTerm = "") {
//   const [page, setPage] = useState(1);
//   const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
//   const [hasMore, setHasMore] = useState(true);

//   const { data, isLoading, isFetching } = useCustomers({
//     page,
//     limit: 30, // load 30 at a time
//     search: searchTerm, // assuming your backend supports search param
//   });

//   useEffect(() => {
//     if (data) {
//       const newCustomers = data.customers;

//       setAllCustomers((prev) => {
//         // Avoid duplicates if refetching same page
//         const existingIds = new Set(prev.map((c) => c.id));
//         const filteredNew = newCustomers.filter((c) => !existingIds.has(c.id));
//         return [...prev, ...filteredNew];
//       });

//       // Update store counts (optional)
//       setCustomers(data);

//       // Check if there's more
//       setHasMore(data.pagination.page < data.pagination.totalPages);
//     }
//   }, [data]);

//   const loadMore = () => {
//     if (!isFetching && hasMore) {
//       setPage((p) => p + 1);
//     }
//   };

//   const reset = () => {
//     setPage(1);
//     setAllCustomers([]);
//     setHasMore(true);
//   };

//   return {
//     customers: allCustomers,
//     isLoading: isLoading && page === 1,
//     isFetchingMore: isFetching && page > 1,
//     hasMore,
//     loadMore,
//     reset,
//   };
// }