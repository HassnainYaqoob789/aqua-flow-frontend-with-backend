// src/app/order/page.tsx
"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Truck,
  Calendar,
  Wallet,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { useOrdersQuery, useDriver } from "@/lib/api/servicesHooks";
import { useDriverStore } from "@/lib/store/useDriver";
import { format } from "date-fns";
import { usePagination } from "@/hooks/usePagination"; // Fixed path
import { formatItems, renderItems, getDeliveryStatus, getStatusColor, getDeliveryStatusText, formatDeliveryDate, formatPayment } from "@/lib/utils/helperFunctions/helperFunctionsOrders";



export default function OrderManagement() {
  const [page, setPage] = useState(1);
  // Fetch orders — limit will be controlled by usePagination
  const { data: apiResponse, isLoading, isError, refetch, } = useOrdersQuery({
    page,
    limit: 10,
  });

  useDriver();
  const drivers = useDriverStore((state) => state.state.drivers);

  // This is the magic: reusable, clean, synced with backend
  const pagination = usePagination(apiResponse?.pagination);

  const handlePrev = () => {
    if (pagination.hasPrev) setPage(pagination.page - 1);
  };

  const handleNext = () => {
    if (pagination.hasNext) setPage(pagination.page + 1);
  };

  // Loading & Error States
  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg">Loading orders...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (isError || !apiResponse) {
    return (
      <DefaultLayout>
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg text-red-600">Failed to load orders.</p>
        </div>
      </DefaultLayout>
    );
  }

  type OrderStats = {
    totalOrders?: number;
    pending?: number;
    in_progress?: number;
    delivered?: number;
    completed?: number;
  };

  const orders = apiResponse.orders || [];
  const stats: OrderStats = apiResponse.stats ?? {};

  const paymentStatusClasses: Record<string, string> = {
    PAID: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    PENDING:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    PARTIAL:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    OVERDUE: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    CANCELLED:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };



  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order Management" description="Manage and track all water delivery orders" />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div />
        <Link href="/order/add-order">
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700">
            <Plus size={20} /> New Order
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-sm border border-stroke bg-white px-6 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          <p className="text-3xl font-bold">{stats.totalOrders ?? 0}</p>
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
          <p className="text-3xl font-bold text-green-600">
            {stats.delivered ?? stats.completed ?? 0}
          </p>
        </div>
      </div>
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark lg:block">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-4 py-4 font-medium xl:pl-11">Order ID</th>
                  <th className="px-4 py-4 font-medium">Customer</th>
                  <th className="px-4 py-4 font-medium">Zone</th>
                  <th className="px-4 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium min-w-40">Delivery Date</th>
                  <th className="px-4 py-4 font-medium">Driver</th>
                  <th className="px-4 py-4 font-medium">Amount</th>
                  <th className="px-4 py-4 font-medium">Payment Status</th>
                  <th className="px-4 py-4 font-medium">Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => {
                  const hasDriver = !!order.driverId;
                  const driverName = order.driver?.name || "";

                  return (
                    <tr key={order.id}>
                      <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                        <span className="inline-block rounded-md bg-gray-800 px-3 py-1 text-white">
                          {order.orderNumberDisplay}
                        </span>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <Link href={`/customer/${order.customer?.id}?mode=view`}>
                          <p className="font-medium">{order.customer?.name || "—"}</p>
                          <p className="text-sm text-gray-500">{order.deliveryAddress}</p>
                        </Link>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <span className="rounded-md bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                          {order.zone?.name || "—"}
                        </span>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        {renderItems(order.items)}
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span
                            className={`rounded-md px-2 py-1 text-xs font-medium ${getDeliveryStatus(
                              order.deliveryDate
                            )}`}
                          >
                            <div>{formatDeliveryDate(order.deliveryDate)}</div>
                            <div className="text-[10px] opacity-80">
                              {getDeliveryStatusText(order.deliveryDate)}
                            </div>
                          </span>
                        </div>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        {!hasDriver ? (
                          <div
                            className="inline-flex items-center px-2 py-0.5 
                 text-xs font-medium 
                 text-gray-600 bg-gray-100 
                 dark:text-gray-300 dark:bg-gray-700/40
                 border border-gray-300 dark:border-gray-600
                 rounded-sm"
                          >
                            No Driver Assigned
                          </div>
                        ) : (
                          <div
                            className="inline-flex items-center gap-1 px-2 py-0.5 
                 text-xs font-medium
                 text-green-700 bg-green-100 
                 dark:text-green-200 dark:bg-green-800/40
                 border border-green-300 dark:border-green-700
                 rounded-sm"
                          >
                            <Truck className="h-3 w-3" />
                            <span className="font-semibold">{driverName}</span>
                          </div>
                        )}
                      </td>

                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        Rs. {order.totalAmount?.toLocaleString()}
                      </td>

                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          <Wallet className="h-3 w-3" />
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(order.status) ??
                            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                        >
                          <Wallet className="h-3 w-3" />
                          {order.status}
                        </span>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      {/* Mobile Cards */}
      <div className="space-y-4 lg:hidden">
        {orders.length > 0 ? (
          orders.map((order: any) => {
            const hasDriver = !!order.driverId;
            const driverName = order.driver?.name || "";

            return (
              <div
                key={order.id}
                className="rounded-lg border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark"
              >
                {/* Header: Order ID + Customer */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block rounded-md bg-gray-800 px-3 py-1 text-sm font-bold text-white">
                      {order.orderNumberDisplay}
                    </span>
                    <Link href={`/customer/${order.customer?.id}?mode=view`}>
                      <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                        {order.customer?.name || "—"}
                      </p>
                      <p className="text-sm text-gray-500">{order.deliveryAddress}</p>
                    </Link>
                  </div>
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </div>

                {/* Details Grid */}
                <div className="space-y-3 text-sm">
                  {/* Zone */}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Zone</span>
                    <span className="rounded-md bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                      {order.zone?.name || "—"}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Items</span>
                    <span className="font-medium">{formatItems(order.items)}</span>
                  </div>

                  {/* Delivery Date & Status */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Delivery</span>
                    <div className="text-right">
                      <div className="font-medium">{formatDeliveryDate(order.deliveryDate)}</div>
                      <span
                        className={`inline-block mt-1 rounded-md px-2 py-0.5 text-xs font-medium ${getDeliveryStatus(
                          order.deliveryDate
                        )}`}
                      >
                        {getDeliveryStatusText(order.deliveryDate)}
                      </span>
                    </div>
                  </div>

                  {/* Driver */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Driver</span>
                    {!hasDriver ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700/40 rounded-sm">
                        No Driver Assigned
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 dark:text-green-200 dark:bg-green-800/40 rounded-sm">
                        <Truck className="h-3.5 w-3.5" />
                        {driverName}
                      </span>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="flex justify-between font-semibold text-base">
                    <span>Amount</span>
                    <span>Rs. {order.totalAmount?.toLocaleString()}</span>
                  </div>

                  {/* Payment & Order Status Row */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-strokedark">
                    <div className="flex items-center gap-1">
                      <Wallet className="h-4 w-4 text-blue-600" />
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${paymentStatusClasses[order.paymentStatus] ||
                          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status) ??
                        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Pagination Controls — Now Clean & Reusable */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {pagination.startItem} to {pagination.endItem} of {pagination.total} orders
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={!pagination.hasPrev}
              className="flex items-center gap-1 rounded-lg border border-stroke px-4 py-2 text-sm disabled:opacity-50 dark:border-strokedark"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <span className="px-4 py-2 text-sm font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={!pagination.hasNext}
              className="flex items-center gap-1 rounded-lg border border-stroke px-4 py-2 text-sm disabled:opacity-50 dark:border-strokedark"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}