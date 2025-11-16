"use client";
import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  AlertCircle,
  Send,
  Download,
  Users,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { useCustomers, useStatusCustomer } from "@/lib/api/servicesHooks";
import { Customer } from "@/lib/types/auth";
import { DataTable } from "@/components/Tables/DataTable";

export default function CustomerManagement() {
  const { data: dataaa, isLoading, isError } = useCustomers();
  const { mutate: updateStatus, isPending } = useStatusCustomer();

  // Use API data if available, otherwise use empty array
  const customers = dataaa?.customers || [];

  const [activeTab, setActiveTab] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusChange = (
    customerId: string,
    status: Customer["status"],
  ) => {
    console.log("Status changed to:", status);

    updateStatus(
      { id: customerId, status },
      {
        onSuccess: () => {
          setOpenId(null);
        },
      },
    );
  };

  const handleStatusToggle = (customer: Customer) => {
    const nextStatus = customer.status === "active" ? "inactive" : "active";

    updateStatus({ id: customer.id, status: nextStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border border-green-200";
      case "sleeping":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      case "inactive":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const stats = [
    { 
      label: "Total Customers", 
      value: dataaa?.counts?.totalCustomers?.toString() || "0"
    },
    {
      label: "Active",
      value: dataaa?.counts?.activeCustomers?.toString() || "0",
      color: "text-green-600",
    },
    {
      label: "Inactive",
      value: dataaa?.counts?.inactiveCustomers?.toString() || "0",
      color: "text-red-600",
    },
  ];

  const tabs = [
    `All Customers (${dataaa?.counts?.totalCustomers || 0})`,
    `Active (${dataaa?.counts?.activeCustomers || 0})`,
    `Inactive (${dataaa?.counts?.inactiveCustomers || 0})`,
  ];

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);

    switch (activeTab) {
      case "All":
        return matchesSearch;
      case "Active":
        return customer.status === "active" && matchesSearch;
      case "Inactive":
        return customer.status === "inactive" && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Customer Management"
        description="Manage and track all water delivery orders"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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

        <div className="p-3 sm:p-6">
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col gap-3 sm:gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 sm:text-sm"
              />
            </div>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 sm:text-sm">
              <Filter size={16} className="sm:size-[18px]" />
              <span>Filter</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6"
              >
                <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  {stat.label}
                </p>
                <p
                  className={`mt-2 text-lg font-bold sm:text-2xl ${stat.color || "text-gray-900 dark:text-white"}`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(tab.split(" ")[0])}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                  activeTab === tab.split(" ")[0]
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading customers...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 shadow-sm dark:border-red-800 dark:bg-red-900/20">
              <div className="text-center">
                <AlertCircle className="mx-auto mb-3 h-12 w-12 text-red-600 dark:text-red-400" />
                <p className="text-red-600 dark:text-red-400">
                  Failed to load customers. Please try again.
                </p>
              </div>
            </div>
          )}

          {/* Customers Table - Responsive */}
          {!isLoading && !isError && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700">
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">
                      Customer
                    </th>
                    <th className="hidden px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm md:table-cell">
                      Contact & Location
                    </th>
                    <th className="hidden px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm lg:table-cell">
                      Joined Date
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">
                      Status
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCustomers.map((customer) => {
                    const createdDate = new Date(
                      customer.createdAt,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <tr
                        key={customer.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-3 py-3 sm:px-6 sm:py-4">
                          <div>
                            <p className="text-xs font-medium text-gray-900 dark:text-white sm:text-sm">
                              {customer.name}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 sm:mt-1">
                              {customer.email}
                            </p>
                            <div className="mt-1 space-y-0.5 md:hidden">
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                📞 {customer.phone}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                📍 {customer.address}, {customer.city}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Joined: {createdDate}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-3 py-3 sm:px-6 sm:py-4 md:table-cell">
                          <div className="text-xs text-gray-900 dark:text-white sm:text-sm">
                            <p className="flex items-center gap-1">
                              📞 {customer.phone}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              📍 {customer.address}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {customer.city}, {customer.postalCode}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {customer.country}
                            </p>
                          </div>
                        </td>
                        <td className="hidden px-3 py-3 sm:px-6 sm:py-4 lg:table-cell">
                          <div className="text-xs sm:text-sm">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {createdDate}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(customer.status)}`}
                          >
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4">
                          <div className="relative flex items-center justify-center gap-1 sm:gap-2">
                            <Link href={`/customer/${customer.id}`}>
                              <button
                                className="p-1 text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300"
                              >
                                <Edit size={16} className="sm:size-[18px]" />
                              </button>
                            </Link>

                            {/* Dropdown Button */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setOpenId(
                                    openId === customer.id ? null : customer.id,
                                  )
                                }
                                className="p-1 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                              >
                                <MoreVertical
                                  size={16}
                                  className="sm:size-[18px]"
                                />
                              </button>

                              {/* Dropdown Menu - Shows opposite status */}
                              {openId === customer.id && (
                                <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700">
                                  {customer.status === "active" ? (
                                    <button
                                      onClick={() =>
                                        handleStatusChange(
                                          customer.id,
                                          "inactive",
                                        )
                                      }
                                      disabled={isPending}
                                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg hover:bg-red-50 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-red-900/30"
                                    >
                                      ✗ Deactivate
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleStatusChange(customer.id, "active")
                                      }
                                      disabled={isPending}
                                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg hover:bg-green-50 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-green-900/30"
                                    >
                                      ✓ Activate
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Empty State */}
              {filteredCustomers.length === 0 && (
                <div className="p-8 text-center">
                  <Users className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm ? "No customers found matching your search" : "No customers found"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Alert Banner - Shows when Inactive tab is active */}
        {activeTab === "Inactive" && filteredCustomers.length > 0 && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20 sm:p-6">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-500" />
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-red-900 dark:text-red-100">
                  Inactive Customers Detected
                </h3>
                <p className="mb-4 text-sm text-red-800 dark:text-red-200">
                  {filteredCustomers.length} customer
                  {filteredCustomers.length !== 1 ? "s" : ""} {filteredCustomers.length !== 1 ? "are" : "is"} currently inactive. Reactivate them to resume orders and services.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700">
                    <Send size={16} />
                    Send Activation SMS
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700">
                    <Download size={16} />
                    Export List
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}