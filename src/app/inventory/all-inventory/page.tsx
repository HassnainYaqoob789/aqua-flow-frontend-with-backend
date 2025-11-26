"use client";

import React from "react";
import {
  Droplets,
  Package,
  Users,
  AlertTriangle,
  DollarSign,
  RefreshCw,
  Plus,
  RotateCcw,
  TrendingDown,
  Link,
  Database,
  TrendingUp,
} from "lucide-react";

import { useInventoryStore } from "@/lib/api/servicesHooks";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation";

export default function InventoryManagement() {
  const { data, isLoading, isError, refetch } = useInventoryStore();
  const router = useRouter();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-2xl font-semibold">Loading Inventory...</div>
      </div>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-600">
          Failed to load inventory data
        </div>
      </div>
    );
  }

const {
  totalBottles,
  inStock,
  withCustomers,
  totalSecurityDeposit,
  lowStockAlert,
  lowStockMessage,
  bottleStockLevels = [],
  recentTransactions = [],
  emptiesTracking = [],
  productInventories = [], // Keep defaults for arrays if they might be undefined
  globalReusablePool, // Remove = {} to use type from InventoryResponse
} = data;

  const totalActiveBottles = totalBottles; // Fallback calculation if needed
  const handleAddInventory = () => {
    router.push("/inventory/add-inventory");
  };
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Inventory Management"
        description="Live tracking of reusable bottles, empties & security deposits"
      />
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleAddInventory}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white font-medium shadow hover:bg-blue-700 transition-colors duration-200 active:bg-blue-800"
          >
            <Plus size={18} />
            Add Inventory
          </button>
        </div>

        {/* Low Stock Alert */}
        {lowStockAlert && (
          <div className="mb-8 flex items-center gap-4 rounded-xl border border-orange-300 bg-orange-100 p-6">
            <AlertTriangle size={48} className="text-orange-600" />
            <div>
              <h3 className="text-xl font-bold text-orange-800">
                Low Stock Alert!
              </h3>
              <p className="text-orange-700">{lowStockMessage}</p>
            </div>
          </div>
        )}

        {/* Top Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-lg">
            <Droplets size={40} />
            <p className="mt-2 text-sm text-blue-100">Total Company Bottles</p>
            <p className="text-4xl font-bold">
              {totalBottles.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-green-600 to-green-700 p-6 text-white shadow-lg">
            <Package size={40} />
            <p className="mt-2 text-sm text-green-100">In Godown (Ready)</p>
            <p className="text-4xl font-bold">{inStock.toLocaleString()}</p>
          </div>

          {/* <div className="rounded-xl bg-gradient-to-br from-yellow-600 to-yellow-700 p-6 text-white shadow-lg">
            <Users size={40} />
            <p className="mt-2 text-sm text-yellow-100">With Customers</p>
            <p className="text-4xl font-bold">
              {withCustomers.toLocaleString()}
            </p>
          </div> */}

          {/* <div className="rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-white shadow-lg">
            <DollarSign size={40} />
            <p className="mt-2 text-sm text-purple-100">
              Total Security Deposit
            </p>
            <p className="text-4xl font-bold">
              Rs. {totalSecurityDeposit.toLocaleString()}
            </p>
          </div> */}
        </div>

        {/* Global Reusable Pool Section (NEW) */}
        <div className="mb-8 rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
            Global Reusable Pool Overview
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Purchased</p>
              <p className="text-2xl font-bold text-blue-600">{globalReusablePool.totalPurchased}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-green-600">{globalReusablePool.inStock}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">With Customers</p>
              <p className="text-2xl font-bold text-yellow-600">{globalReusablePool.withCustomers}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Damaged/Lost</p>
              <p className="text-2xl font-bold text-red-600">{globalReusablePool.damaged + globalReusablePool.lost}</p>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-gray-600">Repairable/Leaked</p>
              <p className="text-2xl font-bold text-indigo-600">{globalReusablePool.repairable + globalReusablePool.leaked}</p>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Security Deposit</p>
              <p className="text-2xl font-bold text-indigo-600"> Rs. {totalSecurityDeposit.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Stock Levels by Size
        <div className="mb-8 rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
            Bottle Stock Levels by Size
          </h2>
          <div className="space-y-8">
            {bottleStockLevels.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                No size-wise data available yet
              </p>
            ) : (
              bottleStockLevels.map((level, i) => (
                <div key={i}>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-lg font-semibold text-black dark:text-white">
                      {level.productName} ({level.size})
                    </span>
                    <span
                      className={`font-bold ${level.isLow ? "text-red-600" : "text-green-600"}`}
                    >
                      {level.available}% Available
                    </span>
                  </div>
                  <div className="h-12 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`flex h-full items-center justify-end px-6 text-lg font-bold text-white transition-all duration-500 ${level.isLow ? "bg-red-600" : "bg-green-600"
                        }`}
                      style={{ width: `${level.available}%` }}
                    >
                      {level.available}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div> */}

        {/* Product-Wise Inventory Table (NEW) */}
        <div className="mb-8 rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
            Product-Wise Inventory Details
          </h2>
          {productInventories.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No product inventory data available yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-700">Product Name</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Size</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Current Stock</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Total Added</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Total Sold</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Available %</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Reusable</th>
                  </tr>
                </thead>
                <tbody>
                  {productInventories.map((inv, i) => {
                    const available = inv.totalAdded > 0 ? Math.round((inv.currentStock / inv.totalAdded) * 100) : 0;
                    return (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">{inv.product.name}</td>
                        <td className="p-4">{inv.product.size}</td>
                        <td className="p-4 text-right font-medium">{inv.currentStock}</td>
                        <td className="p-4 text-right">{inv.totalAdded}</td>
                        <td className="p-4 text-right">
                          {inv.product.isReusable ? (
                            <span className="text-gray-500">-</span>
                          ) : (
                            <span className="text-red-600">{inv.totalSold}</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <span className={available < 10 ? "text-red-600" : "text-green-600"}>
                            {available}%
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={inv.product.isReusable ? "text-green-600" : "text-gray-500"}>
                            {inv.product.isReusable ? "Yes" : "No"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Transactions + Pending Empties */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Transactions */}
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
              Recent Transactions
            </h2>
            {recentTransactions.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                No recent transactions
              </p>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                  >
                    <div>
                      <p className="font-bold text-black dark:text-white">
                        {t.customerName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {t.driverName} • {t.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{t.bottles} bottles</p>
                      <span
                        className={`mt-1 inline-block rounded-full px-4 py-1 text-sm font-medium ${t.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Empties */}
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Pending Empties (Top Customers)
              </h2>
            </div>

            {emptiesTracking.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                No pending empties
              </p>
            ) : (
              <div className="space-y-4">
                {emptiesTracking.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                  >
                    <div>
                      <p className="font-bold text-black dark:text-white">
                        {c.customerName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last return: {c.lastReturn}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">
                        {c.pendingReturn}
                      </p>
                      <p className="text-sm text-gray-600">
                        Rs. {c.securityDeposit.toLocaleString()} deposit
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}