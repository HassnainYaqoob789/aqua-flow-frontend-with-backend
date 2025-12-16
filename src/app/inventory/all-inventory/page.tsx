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
  Database,
  CheckCircle,
} from "lucide-react";

import { useInventoryStore } from "@/lib/api/servicesHooks";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddQuantityModal from "@/components/modals/AddQuantityModal";

export default function InventoryManagement() {
  const { data, isLoading, isError, refetch } = useInventoryStore();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

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
    productInventories = [],
    globalReusablePool,
    customersWithEmpties = [], // ← Added this
  } = data;

  const handleAddInventory = () => {
    setIsAddModalOpen(true);
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Inventory Management"
        description="Live tracking of reusable bottles, empties & security deposits"
      />

      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Header with Actions */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <button
            onClick={handleAddInventory}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white shadow hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Inventory
          </button>
        </div>

        {/* Low Stock Alert */}
        {lowStockAlert && lowStockMessage && (
          <div className="mb-6 rounded-xl border border-orange-300 bg-orange-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 text-orange-600" size={24} />
              <div>
                <h3 className="font-semibold text-orange-800">
                  Low Stock Alert!
                </h3>
                <p className="text-orange-700">{lowStockMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Top Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Bottles */}
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bottles
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalBottles.toLocaleString()}
                </p>
              </div>
              <Droplets className="text-blue-600" size={32} />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Across all products
            </div>
          </div>

          {/* In Stock */}
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Godown</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {inStock.toLocaleString()}
                </p>
              </div>
              <Package className="text-green-600" size={32} />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Available for delivery
            </div>
          </div>

          {/* With Customers */}
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  With Customers
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {withCustomers.toLocaleString()}
                </p>
              </div>
              <Users className="text-purple-600" size={32} />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Currently in circulation
            </div>
          </div>

          {/* Security Deposit */}
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Security Deposit
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  Rs {totalSecurityDeposit.toLocaleString()}
                </p>
              </div>
              <DollarSign className="text-yellow-600" size={32} />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Held from customers
            </div>
          </div>
        </div>

        {/* Global Reusable Pool Section */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Global Reusable Pool
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Database size={16} />
              <span>Overall Bottle Status</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-800">
                Total Purchased
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-900">
                {globalReusablePool.totalPurchased}
              </p>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-medium text-green-800">In Stock</p>
              <p className="mt-1 text-2xl font-bold text-green-900">
                {globalReusablePool.inStock}
              </p>
            </div>

            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-medium text-purple-800">
                With Customers
              </p>
              <p className="mt-1 text-2xl font-bold text-purple-900">
                {globalReusablePool.withCustomers}
              </p>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">Damaged/Lost</p>
              <p className="mt-1 text-2xl font-bold text-red-900">
                {globalReusablePool.damaged + globalReusablePool.lost}
              </p>
            </div>

            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-medium text-orange-800">
                Repairable/Leaked
              </p>
              <p className="mt-1 text-2xl font-bold text-orange-900">
                {globalReusablePool.repairable + globalReusablePool.leaked}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
              Good: {globalReusablePool.inStock} bottles
            </div>
            <div className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
              Circulating: {globalReusablePool.withCustomers} bottles
            </div>
            <div className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
              Issues:{" "}
              {globalReusablePool.damaged +
                globalReusablePool.lost +
                globalReusablePool.repairable +
                globalReusablePool.leaked}{" "}
              bottles
            </div>
          </div>
        </div>

        {/* Product-Wise Inventory Table */}
        <div className="mb-8 overflow-hidden rounded-xl bg-white shadow">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Product-Wise Inventory
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Current stock levels for all products
            </p>
          </div>

          {productInventories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No product inventory data available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Total Added
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Available %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productInventories.map((inv, index) => {
                    const available =
                      inv.totalAdded > 0
                        ? Math.round((inv.currentStock / inv.totalAdded) * 100)
                        : 0;
                    const isLowStock = inv.currentStock < 10;

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {inv.product?.name || "N/A"}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                          {inv.product?.size || "-"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {inv.currentStock}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                          {inv.totalAdded}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 rounded-full bg-gray-200">
                              <div
                                className={`h-full rounded-full ${isLowStock ? "bg-red-600" : "bg-green-600"
                                  }`}
                                style={{
                                  width: `${Math.min(available, 100)}%`,
                                }}
                              />
                            </div>
                            <span
                              className={`font-medium ${isLowStock ? "text-red-600" : "text-green-600"
                                }`}
                            >
                              {available}%
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${inv.product?.isReusable
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {inv.product?.isReusable ? "Reusable" : "Non-Reusable"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {isLowStock ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                              <AlertTriangle size={12} />
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                              <CheckCircle size={12} />
                              Good
                            </span>
                          )}
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

          {/* Pending Empties - Now using customersWithEmpties */}
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Pending Empties (Top Customers)
              </h2>
              {/* <div className="flex items-center gap-2 text-sm text-red-600">
                <RotateCcw size={18} />
                <span>Need Collection</span>
              </div> */}
            </div>

            {customersWithEmpties.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                No pending empties 🎉 All customers have returned bottles!
              </p>
            ) : (
              <div className="space-y-4">
                {[...customersWithEmpties]
                  .sort((a, b) => b.totalEmpties - a.totalEmpties)
                  .map((c, i) => (
                    <div
                      key={i}
                      className={`flex items-start justify-between rounded-lg p-5 transition-all ${c.totalEmpties > 5
                          ? "bg-red-50 border border-red-200"
                          : "bg-gray-50"
                        } dark:bg-gray-800`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-black dark:text-white text-lg">
                            {c.customerName}
                          </p>
                          {c.totalEmpties > 10 && (
                            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                              High Priority
                            </span>
                          )}
                        </div>
                        {/* {c.note ? (
                          <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
                            ⚠️ {c.note}
                          </p>
                        ) : (
                          <p className="mt-1 text-sm text-gray-500">
                            No recent return recorded
                          </p>
                        )} */}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-3xl font-bold text-red-600">
                          {c.totalEmpties}
                        </p>
                        <p className="text-sm text-gray-600">
                          {c.totalEmpties === 1 ? "bottle" : "bottles"} pending
                        </p>
                      </div>
                    </div>
                  ))}

                {/* Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total Customers with Pending Empties</span>
                    <span className="text-red-600">
                      {customersWithEmpties.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold mt-2">
                    <span>Total Pending Bottles</span>
                    <span className="text-red-600">
                      {customersWithEmpties.reduce(
                        (sum, c) => sum + c.totalEmpties,
                        0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddQuantityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </DefaultLayout>
  );
}