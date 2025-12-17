"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  ShoppingCart,
  Truck,
  Users2,
  TrendingUp,
} from "lucide-react";
import { useUsersStats } from "@/lib/api/servicesHooks";
import { useUserStore } from "@/lib/store/useUserStore";
import { formatAmountRs } from "@/lib/utils/helperFunctions/formatAmountRs";

// Dynamic imports for charts
const ChartOne = dynamic(() => import("@/components/Charts/ChartOne"), { ssr: false });

interface StatData {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string; size?: string | number }>;
  bgColor: string;
}

export default function DashboardPage() {
  const { isLoading, isError } = useUsersStats();
  const usersStats = useUserStore(state => state.state.usersStats);

  const apiData = usersStats?.data;
  const stats = apiData?.stats;
  const recentOrders = apiData?.recentOrders || [];
  const topCustomers = apiData?.topCustomers || [];
  const salesChart = apiData?.salesChart;

  const statsData: StatData[] = React.useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: "Total Orders",
        value: stats.totalOrders.toString(),
        icon: ShoppingCart,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
      },
      {
        title: "Revenue",
        value: formatAmountRs(stats.revenue),
        icon: TrendingUp,
        bgColor: "bg-green-100 dark:bg-green-900/30",
      },
      {
        title: "Active Customers",
        value: stats.activeCustomers.toString(),
        icon: Users2,
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
      },
      {
        title: "Active Drivers",
        value: stats.activeDrivers.toString(),
        icon: Truck,
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
      },
    ];
  }, [stats]);

  const getStatusColor = (status: string): string => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400";
      case "delivered":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const formatStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // === 1. LOADING STATE: Only when actually fetching ===
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 sticky top-0 z-40 shadow-sm">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mt-2 animate-pulse"></div>
        </div>

        <div className="p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Chart + Top Customers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6 animate-pulse"></div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6 animate-pulse"></div>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6 animate-pulse"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === 2. TRUE ERROR STATE: Only if error AND no fallback data ===
  if (isError && !usersStats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">Error loading dashboard data</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Please check your connection and try again</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // === 3. NO DATA (but loaded successfully) ===
  if (!apiData || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No dashboard data available yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Start by adding orders, customers, or drivers to see stats here.
          </p>
        </div>
      </div>
    );
  }

  // === 4. MAIN CONTENT: Data is available ===
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 sticky top-0 z-40 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monitor your entire delivery operations
          </p>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon size={24} className="text-gray-700 dark:text-gray-300" />
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts + Top Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition">
            <h3 className="text-base font-semibold text-black dark:text-white">
              Monthly Revenue by Product
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Track sales performance across different products
            </p>
            {salesChart && <ChartOne salesData={salesChart} />}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6">Top Customers</h3>
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {topCustomers.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No customers yet</p>
              ) : (
                topCustomers.slice(0, 5).map((customer: any) => (
                  <div key={customer.id} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {customer.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">
                          {customer.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {customer.ordersCount} {customer.ordersCount === 1 ? "order" : "orders"}
                        </p>
                      </div>
                    </div>
                    {/* <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatAmountRs(customer.totalSpent)}
                    </p> */}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6">Recent Orders</h3>
          <div className="space-y-4 overflow-y-auto h-[360px] pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No recent orders</p>
            ) : (
              <div className="min-w-[600px]">
                {recentOrders.slice(0, 5).map((order: any) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:mb-0"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-medium text-gray-800 dark:text-gray-100">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{order.timeAgo}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                        {order.customerName}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(order.status)}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 min-w-[80px] text-right">
                        {formatAmountRs(order.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}