"use client";

import React from "react";
import { Search, Filter, Plus, MoreVertical } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { useOrderStore } from "@/lib/api/servicesHooks";
import { format } from "date-fns";

// Helper to format items (you can adjust according to your actual item structure)
const formatItems = (items: any[]) => {
  if (!items || items.length === 0) return "—";
  return items
    .map((item) => `${item.quantity || 1}x ${item.product?.name || "Item"}`)
    .join(", ");
};

// Helper to format delivery date (you have deliveryDate in API)
const formatDeliveryDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy");
};

// Status color (matched with your API statuses)
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-gray-900 text-white";
    case "in_progress":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "delivered":
      return "bg-green-50 text-green-700 border border-green-200";
    case "cancelled":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Human readable status
const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Payment method readable
const formatPayment = (method: string) => {
  return method === "cash_on_delivery" ? "COD" : method.replace(/_/g, " ");
};

export default function OrderManagement() {
  const { data: apiResponse, isLoading, isError } = useOrderStore();

  // Show loading state
  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg">Loading orders...</p>
        </div>
      </DefaultLayout>
    );
  }

  // Show error state
  if (isError || !apiResponse) {
    return (
      <DefaultLayout>
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg text-red-600">Failed to load orders.</p>
        </div>
      </DefaultLayout>
    );
  }

  const orders = apiResponse?.orders || [];
  const stats = apiResponse?.stats || {};

  console.log("Orders Data:", orders);

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Order Management"
        description="Manage and track all water delivery orders"
      />

      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="block sm:hidden">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Order Management
          </h2>
        </div>
        <Link href="/order/add-order" className="sm:ml-auto">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto">
            <Plus size={20} />
            New Order
          </button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search orders, customers..."
            className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary sm:text-base"
          />
        </div>
        <div className="flex gap-3 sm:gap-4">
          <select className="flex-1 rounded-lg border border-stroke bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input sm:flex-none sm:px-4 sm:text-base">
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-stroke px-3 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4 sm:px-4 sm:text-base">
            <Filter size={20} />
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Real data from API */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-sm border border-stroke bg-white px-6 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          <p className="text-3xl font-bold text-black dark:text-white">
            {stats.totalOrders ?? 0}
          </p>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-6 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-3xl font-bold text-blue-600">{stats.pending ?? 0}</p>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-6 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">In Progress</p>
          <p className="text-3xl font-bold text-orange-500">{stats.in_progress ?? 0}</p>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-6 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Delivered</p>
          <p className="text-3xl font-bold text-green-600">{stats.delivered ?? 0}</p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark lg:block">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">Order ID</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Customer</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Items</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Delivery Date</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Driver</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Amount</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Payment</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Status</th>
                {/* <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {order.orderNumberDisplay}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {order.customer?.name || "—"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {order.deliveryAddress}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{formatItems(order.items)}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {formatDeliveryDate(order.deliveryDate)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {order.driver?.name || "Unassigned"}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      Rs. {order.totalAmount?.toLocaleString()}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {formatPayment(order.paymentMethod)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <span
                      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </td>
                  {/* <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                      <MoreVertical size={20} />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 lg:hidden">
        {orders.map((order: any) => (
          <div
            key={order.id}
            className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {order.orderNumberDisplay}
                </h3>
                <p className="mt-1 font-medium text-black dark:text-white">
                  {order.customer?.name || "—"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {order.deliveryAddress}
                </p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="space-y-3 border-t border-stroke pt-4 dark:border-strokedark">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Items:</span>
                <span className="font-medium">{formatItems(order.items)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Delivery:</span>
                <span className="font-medium">
                  {formatDeliveryDate(order.deliveryDate)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Driver:</span>
                <span className="font-medium">
                  {order.driver?.name || "Unassigned"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="font-semibold">
                  Rs. {order.totalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Payment:</span>
                <span className="font-medium">
                  {formatPayment(order.paymentMethod)}
                </span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span
                  className={`inline-flex rounded-md px-3 py-1 text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {formatStatus(order.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
}