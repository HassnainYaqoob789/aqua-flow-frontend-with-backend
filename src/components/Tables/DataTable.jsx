// src/components/DataTable.jsx
"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";

export function DataTable({ columns, queryKey, queryFn, pageSize = 10, dataSelector }) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey, page],
    queryFn: () => queryFn(page, pageSize),
    keepPreviousData: true,
  });

  // normalize API response
  const { rows, total } = dataSelector
    ? dataSelector(data)
    : { rows: Array.isArray(data) ? data : [], total: Array.isArray(data) ? data.length : 0 };

  const totalPages = Math.ceil(total / pageSize);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-3 border-b text-left font-semibold text-sm text-gray-700">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 border-b text-sm text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 text-sm rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">Page {page} of {totalPages || 1}</span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-200 text-sm rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
