import React, { forwardRef } from "react";

export interface Column<T extends Record<string, any>> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  title?: string;
  onRowClick?: (row: T) => void;
}

export const DataTable = forwardRef<HTMLDivElement, DataTableProps<any>>(
  (
    {
      columns,
      data = [],
      isLoading = false,
      isError = false,
      totalItems = 0,
      currentPage = 1,
      pageSize = 10,
      onPageChange,
      title,
      onRowClick,
    },
    ref
  ) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    const handlePrevious = () => {
      if (currentPage > 1) {
        onPageChange?.(currentPage - 1);
      }
    };

    const handleNext = () => {
      if (currentPage < totalPages) {
        onPageChange?.(currentPage + 1);
      }
    };

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error loading data</div>
        </div>
      );
    }

    return (
      <div ref={ref} className="w-full bg-white rounded-lg shadow">
        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    style={{ width: column.width }}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data && data.length > 0 ? (
                data.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column) => {
                      const value = row[column.key];
                      return (
                        <td
                          key={String(column.key)}
                          className="px-6 py-4 text-sm text-gray-900"
                        >
                          {column.render
                            ? column.render(value, row)
                            : String(value ?? "")}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-center">
                      <button className="text-gray-400 hover:text-gray-600">
                        •••
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} • {totalItems} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }
);

DataTable.displayName = "DataTable";
