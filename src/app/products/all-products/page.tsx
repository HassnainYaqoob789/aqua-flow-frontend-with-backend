"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Loader2, AlertCircle, Droplets, Coffee, MoreVertical, Recycle } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { IMG_URL } from "@/lib/api/services/endpoints";
import { useProducts } from "@/lib/api/servicesHooks";
import { useStatusProduct } from "@/lib/api/servicesHooks"; // Assuming this is the path; adjust if needed
import { ProductResponse, Product } from "@/lib/types/auth"; // Customer might not be needed; adjust imports

interface LocalProduct {
  id: string;
  name: string;
  size?: string;
  category: "water" | "milk";
  price: number;
  image?: string;
  status?: string;
  createdAt?: string;
  user?: { name: string };
  isReusable: boolean;
  depositAmount?: number;
  requiresEmptyReturn?: boolean;
}

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
  const { mutate: updateStatus, isPending } = useStatusProduct();
  const [localProducts, setLocalProducts] = useState<LocalProduct[]>([]);
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
        isReusable: p.isReusable,
        depositAmount: p.depositAmount,
        requiresEmptyReturn: p.requiresEmptyReturn,
      })) || [];

    const merged = [...apiProducts];
    localProducts.forEach((local) => {
      if (!merged.some((m) => m.id === local.id)) {
        merged.push(local as Product);
      }
    });

    return merged;
  }, [apiResponse, localProducts]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setLocalProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleStatusChange = (
    productId: string,
    status: Product["status"],
  ) => {
    console.log("Status changed to:", status);

    updateStatus(
      { id: productId, status },
      {
        onSuccess: () => {
          setOpenId(null);
        },
      },
    );
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
            href="/products/new"
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
              <th className="hidden px-3 py-3 text-center text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm md:table-cell">
                Reusable
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">
                Price
              </th>
              <th className="hidden px-3 py-3 text-right text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm lg:table-cell">
                Deposit Amount
              </th>
              <th className="hidden px-3 py-3 text-center text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm lg:table-cell">
                Empty Return
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">
                Status
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

                      {/* MOBILE VIEW BLOCK */}
                      <div className="mt-1 space-y-0.5 md:hidden">
                        {product.size && (
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            <Droplets size={12} className="inline h-3 w-3" /> {product.size}
                          </p>
                        )}

                        {product.isReusable && (
                          <p className="text-xs flex items-center gap-1 text-green-600 dark:text-green-400">
                            <Recycle size={12} /> Reusable
                          </p>
                        )}

                        <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                          PKR {product.price.toFixed(2)}
                        </p>

                        {product.depositAmount && product.depositAmount > 0 && (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            Deposit: PKR {product.depositAmount.toFixed(2)}
                          </p>
                        )}

                        <p className={`text-xs ${product.requiresEmptyReturn ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          Req. Empty Return: {product.requiresEmptyReturn ? 'Yes' : 'No'}
                        </p>

                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* IMAGE */}
                  <td className="hidden sm:table-cell px-3 py-3 text-center sm:px-6 sm:py-4">
                    {product.image && (
                      <img
                        src={`${IMG_URL}${product.image}`}
                        alt={`${product.name} image`}
                        className="h-16 w-16 rounded object-contain"
                      />
                    )}
                  </td>

                  {/* SIZE (DESKTOP) */}
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

                  {/* REUSABLE COLUMN (DESKTOP) */}
                  <td className="hidden px-3 py-3 text-center sm:px-6 sm:py-4 md:table-cell">
                    {product.isReusable ? (
                      <Recycle
                        size={18}
                        className="text-green-600 dark:text-green-400 inline-block"
                      />
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
                    )}
                  </td>

                  {/* PRICE */}
                  <td className="px-3 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4">
                    PKR {product.price.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                  </td>

                  {/* DEPOSIT (DESKTOP) */}
                  <td className="hidden px-3 py-3 text-right sm:px-6 sm:py-4 lg:table-cell">
                    <div className="text-xs text-gray-900 dark:text-white sm:text-sm">
                      {product.depositAmount && product.depositAmount > 0 ? (
                        <p className="text-yellow-600 dark:text-yellow-400">
                          PKR {product.depositAmount.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                        </p>
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500">—</p>
                      )}
                    </div>
                  </td>

                  {/* REQUIRES EMPTY RETURN (DESKTOP) */}
                  <td className="hidden px-3 py-3 text-center sm:px-6 sm:py-4 lg:table-cell">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.requiresEmptyReturn ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}>
                      {product.requiresEmptyReturn ? 'Yes' : 'No'}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-3 py-3 sm:px-6 sm:py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-3 py-3 sm:px-6 sm:py-4">
                    <div className="relative flex items-center justify-center gap-1 sm:gap-2">
                      <Link href={`/products/${product.id}`}>
                        <button className="p-1 text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300">
                          <Edit2 size={16} className="sm:size-[18px]" />
                        </button>
                      </Link>

                      <div className="relative">
                        <button
                          onClick={() => setOpenId(openId === product.id ? null : product.id)}
                          className="p-1 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <MoreVertical size={16} className="sm:size-[18px]" />
                        </button>

                        {/* Dropdown Menu - Shows opposite status */}
                        {openId === product.id && (
                          <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700">
                            {status === "active" ? (
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    product.id,
                                    "inactive",
                                  )
                                }
                                disabled={isPending}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg hover:bg-red-50 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-red-900/30"
                              >
                                ✗ Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleStatusChange(product.id, "active")
                                }
                                disabled={isPending}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg hover:bg-green-50 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-green-900/30"
                              >
                                ✓ Activate
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1 text-gray-500 transition-colors hover:text-red-700 dark:text-gray-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} className="sm:size-[18px]" />
                      </button> */}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="p-8 text-center">
            <Droplets className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">
              {isError ? "Failed to load products from server." : "No products available."}
            </p>
            {isError && (
              <p className="text-sm text-gray-400 mt-1">Showing offline/local data if available.</p>
            )}
          </div>
        )}
      </div>


    </DefaultLayout>
  );
}