"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  DollarSign,
  Check,
  AlertCircle,
  TrendingUp,
  Phone,
  Mail,
  PhoneCall,
  Download,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function BillingRecoveries() {
  const [overdueAccounts] = useState([
    {
      customer: "City Hospital",
      phone: "(555) 0126",
      amount: "$240.00",
      dueDate: "Aug 15, 2025",
      daysOverdue: "81 days",
      invoices: "INV-890, INV-891",
      priority: "high",
    },
    {
      customer: "TechStart Inc",
      phone: "(555) 0127",
      amount: "$96.00",
      dueDate: "Oct 20, 2025",
      daysOverdue: "15 days",
      invoices: "INV-1120",
      priority: "medium",
    },
    {
      customer: "Metro School",
      phone: "(555) 0145",
      amount: "$180.00",
      dueDate: "Sep 30, 2025",
      daysOverdue: "35 days",
      invoices: "INV-995, INV-1012",
      priority: "high",
    },
    {
      customer: "John Doe",
      phone: "(555) 0123",
      amount: "$48.50",
      dueDate: "Oct 28, 2025",
      daysOverdue: "7 days",
      invoices: "INV-1234",
      priority: "low",
    },
  ]);

  const getPriorityColor = (priority: "high" | "medium" | "low" | string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border border-red-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "low":
        return "bg-green-50 text-green-700 border border-green-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Billing & Recoveries"
        description="Manage payments and outstanding balances"
      />

      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="block sm:hidden">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Billing & Recoveries
          </h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative rounded-sm border border-stroke bg-white px-6 py-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-black dark:text-white">
              <DollarSign className="mr-1 inline h-4 w-4" />
              Total Revenue
            </p>
          </div>
          <p className="text-2xl font-bold text-black dark:text-white">
            $15,670
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
        </div>
        <div className="relative rounded-sm border border-stroke bg-white px-6 py-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-black dark:text-white">
              <Check className="mr-1 inline h-4 w-4 text-green-600" />
              Collected
            </p>
          </div>
          <p className="text-2xl font-bold text-green-600">$13,220</p>
          <p className="text-xs text-green-600">+12% from last month</p>
        </div>
        <div className="relative rounded-sm border border-stroke bg-white px-6 py-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-black dark:text-white">
              <AlertCircle className="mr-1 inline h-4 w-4 text-red-600" />
              Outstanding
            </p>
          </div>
          <p className="text-2xl font-bold text-red-600">$2,450</p>
          <p className="text-xs text-red-600">18 overdue accounts</p>
        </div>
        <div className="relative rounded-sm border border-stroke bg-white px-6 py-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-black dark:text-white">
              <TrendingUp className="mr-1 inline h-4 w-4 text-purple-600" />
              Collection Rate
            </p>
          </div>
          <p className="text-2xl font-bold text-purple-600">84.4%</p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-purple-600"
              style={{ width: "84.4%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Insight Box */}
      <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-0.5">
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
              30% Faster Collections with Automated SMS
            </p>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Our system has helped recover $450 this month.
            </p>
          </div>
          <button className="ml-auto flex items-center gap-1 whitespace-nowrap rounded-md bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600">
            Send Bulk Reminders
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-stroke dark:border-strokedark">
        <button className="relative flex-1 border-b-2 border-primary px-4 py-3 text-sm font-medium text-primary lg:px-6">
          Overdue Accounts
        </button>
        <button className="relative flex-1 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-primary dark:text-gray-400 lg:px-6">
          Recent Payments
        </button>
        <button className="relative flex-1 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-primary dark:text-gray-400 lg:px-6">
          Accounts Ledger
        </button>
      </div>

      {/* Table Header Actions */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Overdue Accounts
        </h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-stroke px-3 py-2 text-sm transition-colors hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4">
            <Download size={16} />
            Export
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            Send Reminders
          </button>
        </div>
      </div>

      {/* Overdue Accounts Table - Desktop */}
      <div className="hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark lg:block">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-6 py-4 font-medium text-black dark:text-white">
                  Customer
                </th>
                <th className="px-6 py-4 font-medium text-black dark:text-white">
                  Amount Due
                </th>
                <th className="px-6 py-4 font-medium text-black dark:text-white">
                  Due Date
                </th>
                <th className="px-6 py-4 font-medium text-black dark:text-white">
                  Days Overdue
                </th>
                <th className="px-6 py-4 font-medium text-black dark:text-white">
                  Invoices
                </th>
                <th className="px-6 py-4 font-medium text-black dark:text-white">
                  Priority
                </th>
                <th className="px-6 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {overdueAccounts.map((account, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] px-6 py-5 dark:border-strokedark">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {account.phone}
                      </div>
                      <p className="font-medium text-black dark:text-white">
                        {account.customer}
                      </p>
                    </div>
                  </td>
                  <td className="border-b border-[#eee] px-6 py-5 dark:border-strokedark">
                    <p className="font-medium text-red-600">{account.amount}</p>
                  </td>
                  <td className="border-b border-[#eee] px-6 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {account.dueDate}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-6 py-5 dark:border-strokedark">
                    <p className="font-medium text-orange-600">
                      {account.daysOverdue}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-6 py-5 dark:border-strokedark">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {account.invoices}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-6 py-5 dark:border-strokedark">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getPriorityColor(account.priority)}`}
                    >
                      {account.priority}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] px-6 py-5 dark:border-strokedark">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                        <Phone size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                        <Mail size={16} />
                      </button>
                      <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">
                        <PhoneCall size={14} />
                        Follow Up
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overdue Accounts Cards - Mobile & Tablet */}
      <div className="space-y-3 sm:space-y-4 lg:hidden">
        {overdueAccounts.map((account, key) => (
          <div
            key={key}
            className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-black dark:text-white">
                  {account.customer}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {account.phone}
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t border-stroke pt-3 dark:border-strokedark">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Amount Due:
                </span>
                <span className="font-medium text-red-600">
                  {account.amount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Due Date:
                </span>
                <span className="font-medium text-black dark:text-white">
                  {account.dueDate}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Days Overdue:
                </span>
                <span className="font-medium text-orange-600">
                  {account.daysOverdue}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Invoices:
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {account.invoices}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Priority:
                </span>
                <span
                  className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getPriorityColor(account.priority)}`}
                >
                  {account.priority}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    <Phone size={16} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    <Mail size={16} />
                  </button>
                </div>
                <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">
                  <PhoneCall size={14} />
                  Follow Up
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
}
