// components/inputs/SearchableCustomerSelect.tsx
import React, { useRef, useEffect, useState } from "react";
import { useInfiniteCustomers } from "@/lib/api/servicesHooks";
import {
  setCustomersPage,
  setCustomersSearch,
} from "@/lib/store/useCustomerStore";
import { useCustomerStore } from "@/lib/store/useCustomerStore";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean | string;
}

const SearchableCustomerSelect: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Select customer...",
  error,
}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* ---------------- Debounce Search ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 800);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- API Hook ---------------- */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteCustomers(debouncedSearch);

  /* ---------------- Sync Pages to Store ---------------- */
  useEffect(() => {
    if (!data) return;

    data.pages.forEach((page, index) => {
      if (index === 0 && debouncedSearch) {
        setCustomersSearch(page);
      } else {
        setCustomersPage(page);
      }
    });
  }, [data, debouncedSearch]);

  const customers = useCustomerStore((s) => s.state.customers);

  const selectedCustomer = customers.find((c) => c.id === value);

  /* ---------------- Infinite Scroll ---------------- */
  const handleScroll = () => {
    if (!listRef.current || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    if (scrollHeight - scrollTop <= clientHeight + 50) {
      fetchNextPage();
    }
  };

  /* ---------------- Outside Click Close ---------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = customers.map((c) => ({
    value: c.id,
    label: `${c.name} (${c.phone})`,
  }));

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Input */}
      <input
        type="text"
        value={open ? search : selectedCustomer?.name || ""}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        className={`w-full h-[42px] rounded-lg border ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } bg-white dark:bg-gray-700 px-4 text-sm outline-none dark:text-white`}
      />

      {/* Dropdown */}
      {open && (
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg"
        >
          {isLoading && (
            <div className="px-4 py-3 text-sm text-gray-500">
              Loading customers...
            </div>
          )}

          {!isLoading && options.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              No customers found
            </div>
          )}

          {options.map((opt) => (
            <div
              key={opt.value}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
              onMouseDown={() => {
                onChange(opt.value);
                setSearch("");
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}

          {isFetchingNextPage && (
            <div className="px-4 py-3 text-sm text-gray-500">
              Loading more...
            </div>
          )}

          {!hasNextPage && options.length > 0 && (
            <div className="px-4 py-2 text-xs text-center text-gray-400">
              All customers loaded
            </div>
          )}
        </div>
      )}

      {error && typeof error === "string" && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default SearchableCustomerSelect;
