"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  ShoppingCart,
  Truck,
  Users2,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Metadata } from "next";
import { useUsersStats } from "@/lib/api/servicesHooks";
import { useUserStore } from "@/lib/store/useUserStore";

// Dynamic imports for charts to avoid SSR issues
const ChartOne = dynamic(() => import("@/components/Charts/ChartOne"), { ssr: false });
const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), { ssr: false });

export const metadata: Metadata = {
  title: "AquaFlow",
  description: "Manage and track all water delivery orders",
};

interface StatData {
  title: string;
  value: string;
  rate: string;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string; size?: string | number }>;
  bgColor: string;
}

interface RecentOrder {
  id: string;
  status: string;
  amount: string;
  time: string;
}

interface TopCustomer {
  name: string;
  orders: string;
  value: string;
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useUsersStats();
  const usersStats = useUserStore(state => state.state.usersStats);


  const statsData: StatData[] = React.useMemo(() => {
    return [
      {
        title: "Total Orders",
        value: usersStats?.usersStats?.totalCount?.toString() ?? "0",
        rate: "+12.5%",
        trend: "up",
        icon: ShoppingCart,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
      },
      {
        title: "Revenue",
        value: "Rs 45,680",
        rate: "+4.2%",
        trend: "up",
        icon: TrendingUp,
        bgColor: "bg-green-100 dark:bg-green-900/30",
      },
      {
        title: "Active Customers",
        value: usersStats?.usersStats?.totalCount?.toString() ?? "0",
        rate: `${usersStats?.usersStats?.recentUsersPercentage ?? 0}%`,
        trend: "up",
        icon: Users2,
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
      },
      {
        title: "Active Deliveries",
        value: "24",
        rate: "-3.2%",
        trend: "down",
        icon: Truck,
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
      },
    ];
  }, [usersStats]);





  const recentOrders: RecentOrder[] = [
    { id: "P1234", status: "In progress", amount: "$240", time: "2 days ago" },
    { id: "P1235", status: "Pending", amount: "$180", time: "1 day ago" },
    { id: "P1236", status: "Delivered", amount: "$320", time: "3 hours ago" },
    { id: "P1237", status: "In progress", amount: "$90", time: "30 mins ago" },
  ];

  const topCustomers: TopCustomer[] = [
    { name: "Acme Corp", orders: "5 orders", value: "$1890" },
    { name: "TechStart Inc", orders: "3 orders", value: "$1620" },
    { name: "Green Valley", orders: "8 orders", value: "$1540" },
    { name: "City Hospital", orders: "4 orders", value: "$1240" },
    { name: "Metro School", orders: "6 orders", value: "$1125" },
  ];

  // Dummy data for ChartThree
  const chartThreeData = [
    { name: "Orders", value: 1234 },
    { name: "Customers", value: 856 },
    { name: "Deliveries", value: 24 },
  ];
  const chartColors = ["#3C50E0", "#6577F3", "#8FD0EF"];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "In progress":
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400";
      case "Delivered":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

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
            const isPositive = stat.trend === "up";
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon size={24} className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <span
                    className={`text-sm font-medium ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}
                  >
                    {stat.rate}
                  </span>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              Sales Chart
            </h3>
            <ChartOne />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              Performance Overview
            </h3>
            <ChartThree data={chartThreeData} colors={chartColors} />
          </div>
        </div>
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Recent Orders</h3>
              <a
                href="#"
                className="text-blue-500 dark:text-blue-400 text-sm font-medium hover:underline"
              >
                View All
              </a>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">{order.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.time}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                    <p className="font-semibold text-gray-800 dark:text-gray-100 min-w-20 text-right">
                      {order.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Top Customers</h3>
              <a
                href="#"
                className="text-blue-500 dark:text-blue-400 text-sm font-medium hover:underline"
              >
                View All
              </a>
            </div>
            <div className="space-y-4">
              {topCustomers.map((customer) => (
                <div
                  key={customer.name}
                  className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {customer.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                        {customer.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {customer.orders}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {customer.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert */}
        {/* <div className="mt-6 bg-orange-50 dark:bg-orange-900/30 border-l-4 border-orange-400 dark:border-orange-600 p-4 rounded">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-orange-600 dark:text-orange-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-800 dark:text-orange-300">
                Pending Recoveries
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                12 orders pending recovery or outstanding payments. 14 customers
                have overdue balances.
              </p>
              <button className="mt-2 bg-orange-600 dark:bg-orange-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-700 dark:hover:bg-orange-600 transition">
                View Recovery Report
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}