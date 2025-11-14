// app/products/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface Product {
  id: string;
  name: string;
  size: string;
  category: "water" | "milk";
  price: number;
  description?: string;
}

// Initial products data
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
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("products");
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const waterProducts = products.filter((p) => p.category === "water");
  const milkProducts = products.filter((p) => p.category === "milk");

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Manage Products"
        description="Add, edit, and delete water and milk bottles"
      />

      <div className="mb-6 flex justify-end">
        <Link
          href="/products/add-products"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 dark:bg-blue-500"
        >
          <Plus size={20} />
          Add New Product
        </Link>
      </div>

      {/* Products Tables */}
      <div className="space-y-8">
        {/* Water Products */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
            <h3 className="text-lg font-bold text-black dark:text-white">
              Products
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke dark:border-strokedark">
                  <th className="py-3 px-6 text-left text-sm font-medium">Name</th>
                  <th className="py-3 px-6 text-left text-sm font-medium">Size</th>
                  <th className="py-3 px-6 text-center text-sm font-medium">Price</th>
                  <th className="py-3 px-6 text-center text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {waterProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-stroke dark:border-strokedark"
                  >
                    <td className="py-4 px-6 text-sm">{product.name}</td>
                    <td className="py-4 px-6 text-sm">{product.size}</td>
                    <td className="py-4 px-6 text-center text-sm font-medium">
                      PKR{product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-3">
                        <Link
                          href={`/products/form?mode=edit&id=${product.id}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}