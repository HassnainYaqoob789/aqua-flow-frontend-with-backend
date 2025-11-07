"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  FileText,
  Users,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Funnel,
} from "lucide-react";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import dynamic from "next/dynamic";

// Dynamic imports for charts to avoid SSR window issues
const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), { ssr: false });
const ChartOne = dynamic(() => import("@/components/Charts/ChartOne"), { ssr: false });
const ChartTwo = dynamic(() => import("@/components/Charts/ChartTwo"), { ssr: false });
const ProductRevenueChart = dynamic(() => import("@/components/Tables/ProductRevenueChart"), { ssr: false });

export default function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [filter, setFilter] = useState("All");

  const revenueData = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 18000 },
    { month: "Apr", revenue: 20000 },
    { month: "May", revenue: 22000 },
    { month: "Jun", revenue: 25000 },
  ];

  const growthData = [
    { month: "Jan", customers: 200, orders: 150 },
    { month: "Feb", customers: 250, orders: 180 },
    { month: "Mar", customers: 300, orders: 220 },
    { month: "Apr", customers: 350, orders: 260 },
    { month: "May", customers: 400, orders: 300 },
    { month: "Jun", customers: 450, orders: 350 },
  ];

  const productSalesData = [
    { name: "20L Bottles", value: 560 },
    { name: "10L Bottles", value: 340 },
    { name: "5L Bottles", value: 160 },
  ];

  const productRevenueData = [
    { product: "20L Bottles", revenue: 54720 },
    { product: "10L Bottles", revenue: 18720 },
    { product: "5L Bottles", revenue: 7800 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const quickReports = [
    {
      title: "Monthly Sales Report",
      desc: "Comprehensive sales analysis with revenue breakdown",
      color: "bg-blue-500",
      pdf: true,
      excel: true,
    },
    {
      title: "Customer Activity Report",
      desc: "Active vs sleeping customers with engagement metrics",
      color: "bg-green-500",
      pdf: true,
      excel: true,
    },
    {
      title: "Recovery Report",
      desc: "Outstanding balances and collection performance",
      color: "bg-orange-500",
      pdf: true,
      excel: true,
    },
    {
      title: "Driver Performance Report",
      desc: "Delivery metrics, ratings, and efficiency analysis",
      color: "bg-purple-500",
      pdf: true,
      excel: true,
    },
    {
      title: "Inventory Report",
      desc: "Stock levels, empties tracking, and security deposits",
      color: "bg-indigo-500",
      pdf: true,
      excel: true,
    },
    {
      title: "Expense Ledger",
      desc: "Detailed expense tracking and cost analysis",
      color: "bg-red-500",
      pdf: true,
      excel: true,
    },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Reports & Analytics"
        description="Generate insights and export data"
      />

      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="block sm:hidden">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Reports & Analytics
          </h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
          >
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
          >
            <option>All</option>
            <option>Sales</option>
            <option>Customers</option>
            <option>Inventory</option>
          </select>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickReports.map((report, key) => (
          <div
            key={key}
            className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className={`rounded-lg p-2 ${report.color} text-white`}>
                <FileText size={20} />
              </div>
              <div className="flex gap-1">
                {report.pdf && (
                  <button className="p-1 text-gray-500 hover:text-primary">
                    <Download size={14} />
                  </button>
                )}
                {report.excel && (
                  <button className="p-1 text-gray-500 hover:text-primary">
                    <Download size={14} />
                  </button>
                )}
              </div>
            </div>
            <h4 className="mb-1 font-semibold text-black dark:text-white">
              {report.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {report.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-black dark:text-white">
              Revenue Trend
            </h3>
          </div>
          <ChartOne />
        </div>

        {/* Orders & Customer Growth */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-black dark:text-white">
              Orders & Customer Growth
            </h3>
          </div>
          <ChartTwo />
        </div>
      </div>

      {/* Product Sales Distribution & Product Revenue */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-black dark:text-white">
              Product Sales Distribution
            </h3>
          </div>
          <ChartThree data={productSalesData} colors={COLORS} />
        </div>
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold text-black dark:text-white">
              Product Revenue
            </h3>
          </div>
          <ProductRevenueChart data={productRevenueData} />
        </div>
      </div>
    </DefaultLayout>
  );
}