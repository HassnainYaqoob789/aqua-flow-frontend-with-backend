// // src/lib/hooks/usePagination.ts
// import { useState, useEffect } from "react";

// interface PaginationMeta {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
// }

// interface UsePaginationOptions {
//     initialPage?: number;
//     initialLimit?: number;
// }

// export function usePagination(
//     meta: PaginationMeta | undefined | null,
//     options: UsePaginationOptions = {}
// ) {
//     const { initialPage = 1, initialLimit = 10 } = options;

//     const [page, setPage] = useState(initialPage);
//     const [limit, setLimit] = useState<number | null>(null);

//     // Sync limit from server on first valid response
//     useEffect(() => {
//         if (meta?.limit && limit === null) {
//             setLimit(meta.limit);
//         }
//     }, [meta?.limit, limit]);

//     // Optional: keep page in sync if server forces a different page (e.g. page 999 → 1)
//     useEffect(() => {
//         if (meta && meta.page !== page) {
//             setPage(meta.page);
//         }
//     }, [meta?.page]);

//     const currentPage = meta?.page ?? page;
//     const currentLimit = limit ?? meta?.limit ?? initialLimit;
//     const total = meta?.total ?? 0;
//     const totalPages = meta?.totalPages ?? 1;

//     const startItem = total === 0 ? 0 : (currentPage - 1) * currentLimit + 1;
//     const endItem = Math.min(currentPage * currentLimit, total);

//     const goToPage = (newPage: number) => {
//         if (newPage >= 1 && newPage <= totalPages) {
//             setPage(newPage);
//         }
//     };

//     const next = () => goToPage(currentPage + 1);
//     const prev = () => goToPage(currentPage - 1);

//     const reset = () => {
//         setPage(initialPage);
//         setLimit(null);
//     };

//     return {
//         page: currentPage,
//         limit: currentLimit,
//         total,
//         totalPages,
//         startItem,
//         endItem,
//         hasNext: currentPage < totalPages,
//         hasPrev: currentPage > 1,
//         next,
//         prev,
//         goToPage,
//         reset,
//         rawMeta: meta,
//     };
// };

// src/lib/hooks/usePagination.ts

import { useState, useEffect } from "react";

interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface UsePaginationOptions {
    initialPage?: number;
    initialLimit?: number;
}

export function usePagination(
    meta: PaginationMeta | undefined | null,
    options: UsePaginationOptions = {}
) {
    const { initialPage = 1, initialLimit = 10 } = options;

    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState<number | null>(null);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Fully sync ALL meta from server whenever it's available
    useEffect(() => {
        if (meta) {
            setPage(meta.page);
            if (limit === null) {
                setLimit(meta.limit);
            }
            setTotal(meta.total);
            setTotalPages(meta.totalPages);
        }
    }, [meta]);  // Depend on the entire meta object

    const currentPage = page;
    const currentLimit = limit ?? meta?.limit ?? initialLimit;

    const startItem = total === 0 ? 0 : (currentPage - 1) * currentLimit + 1;
    const endItem = Math.min(currentPage * currentLimit, total);

    const goToPage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const next = () => goToPage(currentPage + 1);
    const prev = () => goToPage(currentPage - 1);

    const reset = () => {
        setPage(initialPage);
        setLimit(null);
        setTotal(0);
        setTotalPages(1);
    };

    return {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages,
        startItem,
        endItem,
        hasNext: currentPage < totalPages && totalPages > 1,
        hasPrev: currentPage > 1,
        next,
        prev,
        goToPage,
        reset,
        rawMeta: meta,
    };
}