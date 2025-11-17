"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Loader2, AlertCircle } from "lucide-react";
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

// Fallback products (only if API fails and no local data)
const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Water Bottle", size: "19L", category: "water", price: 5.99 },
  { id: "2", name: "Water Bottle", size: "10L", category: "water", price: 3.49 },
  { id: "3", name: "Water Bottle", size: "5L", category: "water", price: 2.49 },
  { id: "4", name: "Water Bottle", size: "1.5L", category: "water", price: 1.49 },
  { id: "5", name: "Water Bottle", size: "500ml (Pack of 6)", category: "water", price: 2.99 },
  { id: "6", name: "Milk Bottle", size: "1L", category: "milk", price: 2.99 },
  { id: "7", name: "Milk Bottle", size: "2L", category: "milk", price: 4.99 },
  { id: "8", name: "Milk Bottle", size: "500ml (Pack of 6)", category: "milk", price: 3.99 },
];

export default function ProductsPage() {
  const { data: apiResponse, isLoading, isError } = useProducts();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

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

    return merged.length > 0 ? merged : INITIAL_PRODUCTS;
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

  // Error state (fallback to local/initial)
  if (isError) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Manage Products" />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
          <p className="text-lg text-red-600">Failed to load products from server.</p>
          <p className="text-sm text-gray-500 mt-1">Showing offline/local data.</p>
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
      <div className="mb-6 flex justify-end">
        <Link
          href="/products/add-products"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add New Product
        </Link>
      </div>

      {/* Unified Products Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="text-xl font-bold text-black dark:text-white">
            All Products ({products.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-stroke bg-gray-50 dark:border-strokedark dark:bg-meta-4">
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                  Category
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                  Size
                </th>
                <th className="py-3 px-6 text-center text-sm font-medium text-gray-700 dark:text-gray-200">
                  Price
                </th>
                <th className="py-3 px-6 text-center text-sm font-medium text-gray-700 dark:text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No products available.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm font-medium text-black dark:text-white">
                      {product.name}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          product.category === "milk"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        }`}
                      >
                        {product.category === "milk" ? "Milk" : "Water"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                      {product.size || "—"}
                    </td>
                    <td className="py-4 px-6 text-center text-sm font-semibold text-green-600 dark:text-green-400">
                      PKR {product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-3">
                        <Link
                          href={`/products/form?mode=edit&id=${product.id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit product"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
}