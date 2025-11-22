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
} from "lucide-react";

import { useInventoryStore } from "@/lib/api/servicesHooks";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default function InventoryManagement() {
  const { data, isLoading, isError, refetch } = useInventoryStore();

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
        <div className="text-red-600 text-xl">Failed to load inventory data</div>
      </div>
    );
  }

  const {
    totalBottles,
    inStock,
    withCustomers,
    totalActiveBottles,
    totalSecurityDeposit,
    lowStockAlert,
    lowStockMessage,
    bottleStockLevels = [],
    recentTransactions = [],
    emptiesTracking = [],
  } = data;

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Inventory Management"
        description="Live tracking of reusable bottles, empties & security deposits"
      />
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-3 py-4 dark:border-gray-700 dark:bg-gray-800 sm:px-6 sm:py-8">
          <div className="flex justify-end">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Link href="/customer/new" className="sm:ml-auto">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto">
                  <Plus size={20} />
                  Add Customer
                </button>
              </Link>
            </div>
          </div>
        </div>


        {/* Low Stock Alert */}
        {lowStockAlert && (
          <div className="mb-8 flex items-center gap-4 rounded-xl bg-orange-100 p-6 border border-orange-300">
            <AlertTriangle size={48} className="text-orange-600" />
            <div>
              <h3 className="text-xl font-bold text-orange-800">Low Stock Alert!</h3>
              <p className="text-orange-700">{lowStockMessage}</p>
            </div>
          </div>
        )}

        {/* Top Stats Cards */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
            <Droplets size={40} />
            <p className="text-blue-100 mt-2 text-sm">Total Company Bottles</p>
            <p className="text-4xl font-bold">{totalBottles.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-xl shadow-lg">
            <Package size={40} />
            <p className="text-green-100 mt-2 text-sm">In Godown (Ready)</p>
            <p className="text-4xl font-bold">{inStock.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 text-white p-6 rounded-xl shadow-lg">
            <Users size={40} />
            <p className="text-yellow-100 mt-2 text-sm">With Customers</p>
            <p className="text-4xl font-bold">{withCustomers.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-xl shadow-lg">
            <DollarSign size={40} />
            <p className="text-purple-100 mt-2 text-sm">Total Security Deposit</p>
            <p className="text-4xl font-bold">Rs. {totalSecurityDeposit.toLocaleString()}</p>
          </div>
        </div>

        {/* Stock Levels by Size */}
        <div className="mb-8 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
            Bottle Stock Levels by Size
          </h2>
          <div className="space-y-8">
            {bottleStockLevels.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No size-wise data available yet</p>
            ) : (
              bottleStockLevels.map((level, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-semibold text-black dark:text-white">
                      {level.size} Bottle
                    </span>
                    <span className={`font-bold ${level.isLow ? "text-red-600" : "text-green-600"}`}>
                      {level.available}% Available
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-12 overflow-hidden">
                    <div
                      className={`h-full flex items-center justify-end px-6 text-white font-bold text-lg transition-all duration-500 ${level.isLow ? "bg-red-600" : "bg-green-600"
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
        </div>

        {/* Recent Transactions + Pending Empties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Transactions */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
              Recent Transactions
            </h2>
            {recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent transactions</p>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <p className="font-bold text-black dark:text-white">{t.customerName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {t.driverName} • {t.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">{t.bottles} bottles</p>
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-sm font-medium mt-1 ${t.status === "Completed"
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
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Pending Empties (Top Customers)
              </h2>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                <RotateCcw size={18} />
                Reconcile All
              </button>
            </div>

            {emptiesTracking.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending empties</p>
            ) : (
              <div className="space-y-4">
                {emptiesTracking.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <p className="font-bold text-black dark:text-white">{c.customerName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last return: {c.lastReturn}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">{c.pendingReturn}</p>
                      <p className="text-sm text-gray-600">Rs. {c.securityDeposit.toLocaleString()} deposit</p>
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