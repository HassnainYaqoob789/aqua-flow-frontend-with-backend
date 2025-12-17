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

// Dynamic imports for charts to avoid SSR issues
const ChartOne = dynamic(() => import("@/components/Charts/ChartOne"), { ssr: false });
const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), { ssr: false });

interface StatData {
  title: string;
  value: string;
  // rate: string;
  // trend: "up" | "down";
  icon: React.ComponentType<{ className?: string; size?: string | number }>;
  bgColor: string;
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useUsersStats();
  const usersStats = useUserStore(state => state.state.usersStats);

  // Extract data from API response
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
        // rate: "+12.5%",
        // trend: "up",
        icon: ShoppingCart,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
      },
      {
        title: "Revenue",
        value: formatAmountRs(stats.revenue),
        // rate: "+4.2%",
        // trend: "up",
        icon: TrendingUp,
        bgColor: "bg-green-100 dark:bg-green-900/30",
      },
      {
        title: "Active Customers",
        value: stats.activeCustomers.toString(),
        // rate: "0%",
        // trend: "up",
        icon: Users2,
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
      },
      {
        title: "Active Drivers",
        value: stats.activeDrivers.toString(),
        // rate: "-3.2%",
        // trend: "down",
        icon: Truck,
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
      },
    ];
  }, [stats]);

  // Chart data based on API stats
  const chartThreeData = React.useMemo(() => {
    if (!stats) return [];

    return [
      { name: "Orders", value: stats.totalOrders },
      { name: "Customers", value: stats.activeCustomers },
      { name: "Drivers", value: stats.activeDrivers },
    ];
  }, [stats]);

  const chartColors = ["#3C50E0", "#6577F3", "#8FD0EF"];

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

  // Skeleton Loader Component
  if (!usersStats && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Top Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 sticky top-0 z-40 shadow-sm">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
                <div className="h-[350px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders Skeleton */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Customers Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError && !usersStats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">Error loading dashboard data</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Please check your API connection</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If no data available at all
  if (!usersStats || !apiData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Top Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monitor your entire delivery operations
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            // const isPositive = stat.trend === "up";
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon size={24} className="text-gray-700 dark:text-gray-300" />
                  </div>
                  {/* <span
                    className={`text-sm font-medium ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}
                  >
                    {stat.rate}
                  </span> */}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
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

          {/* Top Customers */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Top Customers</h3>
              {/* <a
                href="#"
                className="text-blue-500 dark:text-blue-400 text-sm font-medium hover:underline"
              >
                View All
              </a> */}
            </div>
            <div className="space-y-4 overflow-y-auto h-[360px] pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {topCustomers.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No customers yet
                </p>
              ) : (
                topCustomers.slice(0, 5).map((customer: any) => (
                  <div
                    key={customer.id}
                    className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {customer.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">
                          {customer.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {customer.ordersCount} {customer.ordersCount === 1 ? 'order' : 'orders'}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatAmountRs(customer.totalSpent)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>


        <div className="w-full">
          {/* Recent Orders Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Recent Orders
              </h3>
              {/* Optional "View All" */}
              {/* <a
            href="#"
            className="text-blue-500 dark:text-blue-400 text-sm font-medium hover:underline"
          >
            View All
          </a> */}
            </div>

            {/* Orders List */}
            <div className="space-y-4 overflow-y-auto h-[360px] pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No recent orders
                </p>
              ) : (
                <div className="min-w-[600px]">
                  {recentOrders.slice(0, 5).map((order: any) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:mb-0"
                    >
                      {/* Order Info */}
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.timeAgo}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                          {order.customerName}
                        </p>
                      </div>

                      {/* Status + Amount */}
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
    </div>
  );
}