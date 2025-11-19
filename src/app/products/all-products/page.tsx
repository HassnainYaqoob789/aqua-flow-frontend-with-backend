"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Loader2, AlertCircle, Droplets, Coffee, MoreVertical } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useProducts } from "@/lib/api/servicesHooks";

interface Product {
  id: string;
  name: string;
  size?: string;
  category: "water" | "milk";
  price: number;
  image?: string;
  status?: string;
  createdAt?: string;
  user?: { name: string };
}

const BASE_IMAGE_URL = "http://192.168.18.107:7000";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "inactive":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export default function ProductsPage() {
  const { data: apiResponse, isLoading, isError } = useProducts();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  // Load custom products from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("custom_products");
      if (saved) {
        setLocalProducts(JSON.parse(saved));
      }
    }
  }, []);

  // Save custom products to localStorage
  useEffect(() => {
    if (localProducts.length > 0) {
      localStorage.setItem("custom_products", JSON.stringify(localProducts));
    }
  }, [localProducts]);

  // Combine API + local products
  const products = useMemo(() => {
    const apiProducts: Product[] =
      apiResponse?.products?.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        status: p.status,
        createdAt: p.createdAt,
        user: p.user,
        category: p.name.toLowerCase().includes("milk") ? "milk" : "water",
        size: p.size || extractSizeFromName(p.name),
      })) || [];

    const merged = [...apiProducts];
    localProducts.forEach((local) => {
      if (!merged.some((m) => m.id === local.id)) {
        merged.push(local);
      }
    });

    return merged;
  }, [apiResponse, localProducts]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setLocalProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Extract size from product name
  function extractSizeFromName(name: string): string | undefined {
    const match = name.match(/(1\.5L|19L|10L|5L|1L|2L|500ml|\d+L|\d+ml)/i);
    return match ? match[0] : undefined;
  }

  // Loading state
  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Manage Products" />
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-lg text-gray-600">Loading products...</span>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Manage Products"
        description="View and manage all water and milk products"
      />

      {/* Add Button */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 mb-6">

        {/* Top Actions */}
        <div className="mb-6 flex justify-end">
          <Link
            href="/products/add-products"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add New Product
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
          <h3 className="text-xl font-bold text-black dark:text-white">
            All Products
            {/* ({products.length}) */}
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700">
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">
                Product
              </th>
              <th className="hidden sm:table-cell px-3 py-3 text-center text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">
                Image
              </th>
              <th className="hidden px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm md:table-cell">
                Size
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">
                Price
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">
                Status
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => {
              const status = product.status || "active";
              return (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-3 sm:px-6 sm:py-4">
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white sm:text-sm">
                        {product.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1 sm:mt-1">
                        {product.category === "water" ? (
                          <Droplets size={14} className="text-blue-500" />
                        ) : (
                          <Coffee size={14} className="text-purple-500" />
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.category === "milk" ? "Milk" : "Water"}
                        </p>
                      </div>
                      <div className="mt-1 space-y-0.5 md:hidden">
                        {product.size && (
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            <Droplets size={12} className="inline h-3 w-3" /> {product.size}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                          PKR {product.price.toFixed(2)}
                        </p>
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 py-3 text-center sm:px-6 sm:py-4">
                    {product.image && (
                      <img
                        src={`${BASE_IMAGE_URL}${product.image}`}
                        alt={`${product.name} image`}
                        className="h-16 w-16 rounded object-contain"
                      />
                    )}
                  </td>
                  <td className="hidden px-3 py-3 sm:px-6 sm:py-4 md:table-cell">
                    <div className="text-xs text-gray-900 dark:text-white sm:text-sm">
                      {product.size ? (
                        <p className="flex items-center gap-1">
                          <Droplets size={14} className="text-blue-500" />
                          {product.size}
                        </p>
                      ) : (
                        <p>-</p>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4">
                    PKR {product.price.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4">
                    <div className="relative flex items-center justify-center gap-1 sm:gap-2">
                      <Link href={`/products/form?mode=edit&id=${product.id}`}>
                        <button className="p-1 text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300">
                          <Edit2 size={16} className="sm:size-[18px]" />
                        </button>
                      </Link>
                      {/* Dropdown Button */}
                      <div className="relative">
                        <button
                          onClick={() => setOpenId(openId === product.id ? null : product.id)}
                          className="p-1 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <MoreVertical size={16} className="sm:size-[18px]" />
                        </button>
                        {/* Dropdown Menu */}
                        {openId === product.id && (
                          <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700">
                            <button
                              onClick={() => {
                                handleDelete(product.id);
                                setOpenId(null);
                              }}
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg hover:bg-red-50 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-red-900/30"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="p-8 text-center">
            <Droplets className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">
              {isError ? "Failed to load products from server." : "No products available."}
            </p>
            {isError && (
              <p className="text-sm text-gray-400 mt-1">
                Showing offline/local data if available.
              </p>
            )}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}