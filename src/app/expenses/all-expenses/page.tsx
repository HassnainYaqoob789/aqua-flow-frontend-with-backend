"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  TrendingUp,
  PieChart,
  BarChart3,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";

// Lazy load charts (SSR safe)
const ChartOne = dynamic(() => import("@/components/Charts/ChartOne"), {
  ssr: false,
});
const ChartTwo = dynamic(() => import("@/components/Charts/ChartTwo"), {
  ssr: false,
});
const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

interface Order {
  id: string;
  date: string;
  category: string;
  description: string;
  vendor: string;
  amount: string;
  payment: string;
  status: "Approved" | "Pending" | "Processing" | "Rejected";
}

export default function ExpenseManagement() {
  const [orders] = useState<Order[]>([
    {
      id: "EXP-001",
      date: "Nov 2, 2025",
      category: "Fuel",
      description: "Fuel - Delivery Vehicles",
      vendor: "Shell Petrol Station",
      amount: "$2,450.00",
      payment: "Paid",
      status: "Approved",
    },
    {
      id: "EXP-002",
      date: "Nov 3, 2025",
      category: "Maintenance",
      description: "Vehicle Maintenance & Repairs",
      vendor: "City Auto Workshop",
      amount: "$1,850.00",
      payment: "Pending",
      status: "Pending",
    },
    {
      id: "EXP-003",
      date: "Nov 4, 2025",
      category: "Staff",
      description: "Staff Salary - November",
      vendor: "Payroll System",
      amount: "$12,500.00",
      payment: "Paid",
      status: "Approved",
    },
    {
      id: "EXP-004",
      date: "Nov 4, 2025",
      category: "Equipment",
      description: "Water Cooler & Equipment",
      vendor: "Water Equipment Co",
      amount: "$3,200.00",
      payment: "Partial",
      status: "Processing",
    },
    {
      id: "EXP-005",
      date: "Nov 4, 2025",
      category: "Utilities",
      description: "Electricity & Water Bill",
      vendor: "City Utilities",
      amount: "$890.00",
      payment: "Paid",
      status: "Approved",
    },
    {
      id: "EXP-006",
      date: "Nov 4, 2025",
      category: "Marketing",
      description: "Social Media Marketing Services",
      vendor: "Digital Marketing Agency",
      amount: "$4,100.00",
      payment: "Paid",
      status: "Approved",
    },
  ]);

  // Expense categories data for ChartThree (pie chart)
  const expenseCategoriesData = [
    { name: "Fuel", value: 2450 },
    { name: "Maintenance", value: 1850 },
    { name: "Staff", value: 12500 },
    { name: "Equipment", value: 3200 },
    { name: "Utilities", value: 890 },
    { name: "Marketing", value: 4100 },
  ];

  const chartColors = ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF", "#FFBB28", "#00C49F"];

  const getStatusColor = (status: Order["status"]): string => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Expense Management"
        description="Track and manage all business expenses"
      />

      {/* Action + Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Search className="text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="w-full rounded-lg border border-stroke px-4 py-2 text-sm outline-none dark:border-strokedark dark:bg-form-input sm:w-72"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-stroke px-4 py-2 text-sm hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4">
            <Filter size={18} /> Filters
          </button>
          <Link href="/expenses/add-expenses" className="sm:ml-auto">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto">
              <Plus size={20} />
              Add Expense
            </button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Expenses", value: "$24,870", color: "text-red-500" },
          { label: "Paid", value: "$20,270", color: "text-green-600" },
          { label: "Pending", value: "$4,600", color: "text-yellow-500" },
          { label: "Avg/Month", value: "$19,870", color: "text-blue-600" },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-lg border border-stroke bg-white px-5 py-6 shadow-sm dark:border-strokedark dark:bg-boxdark"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className={`mt-1 text-2xl font-bold ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-2">
        {/* Pie Chart */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="mb-4 flex items-center gap-2">
            <PieChart className="text-purple-500" size={20} />
            <h3 className="font-semibold text-black dark:text-white">
              Expense by Category
            </h3>
          </div>
          <ChartThree data={expenseCategoriesData} colors={chartColors} />
        </div>

        {/* Line Chart */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            <h3 className="font-semibold text-black dark:text-white">
              Monthly Expense Trend
            </h3>
          </div>
          <ChartOne />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-6 rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="text-indigo-600" size={20} />
          <h3 className="font-semibold text-black dark:text-white">
            Category Comparison (Current vs Previous Month)
          </h3>
        </div>
        <ChartTwo />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700 dark:bg-meta-4 dark:text-white">
                <th className="p-4">Date</th>
                <th className="p-4">Category</th>
                <th className="p-4">Description</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4"
                >
                  <td className="p-4 text-sm text-gray-700 dark:text-white">
                    {order.date}
                  </td>
                  <td className="p-4 text-sm font-medium text-black dark:text-white">
                    {order.category}
                  </td>
                  <td className="p-4 text-sm text-gray-700 dark:text-white">
                    {order.description}
                  </td>
                  <td className="p-4 text-sm text-gray-700 dark:text-white">
                    {order.vendor}
                  </td>
                  <td className="p-4 text-sm font-semibold text-black dark:text-white">
                    {order.amount}
                  </td>
                  <td className="p-4 text-sm text-gray-700 dark:text-white">
                    {order.payment}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <MoreVertical
                      size={16}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget Alert */}
      <div className="mt-6 rounded-lg border-l-4 border-orange-400 bg-orange-50 p-4 dark:border-orange-600 dark:bg-orange-900/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-1 text-orange-500" />
          <div>
            <h4 className="font-semibold text-orange-800 dark:text-orange-300">
              Budget Alert
            </h4>
            <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
              Current month expenses are 15% higher than the average. Review
              high-cost categories.
            </p>
            <div className="mt-3 flex gap-3">
              <button className="rounded bg-orange-600 px-3 py-2 text-xs font-medium text-white hover:bg-orange-700">
                View Budget Report
              </button>
              <button className="rounded border border-orange-600 px-3 py-2 text-xs font-medium text-orange-700 hover:bg-orange-100">
                Set Budget Limits
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}