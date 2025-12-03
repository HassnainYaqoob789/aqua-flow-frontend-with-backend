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
  X,
  CreditCard,
} from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

interface OverdueAccount {
  id: number;
  customer: string;
  phone: string;
  deposit: string;
  amount: string;
  amountNumeric: number;
  dueDate: string;
  daysOverdue: string;
  invoices: string;
  priority: "high" | "medium" | "low";
}

interface RecentPayment {
  customer: string;
  phone: string;
  deposit: string;
  amount: string;
  invoice: string;
  paymentDate: string;
  paymentMethod: string;
  status: "completed" | "pending";
}

interface LedgerEntry {
  customer: string;
  phone: string;
  invoice: string;
  date: string;
  description: string;
  debit: string;
  credit: string;
  balance: string;
}

export default function BillingRecoveries() {
  
  const [activeTab, setActiveTab] = useState<"overdue" | "payments" | "ledger">("overdue");
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<OverdueAccount | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Bank Transfer");
  const [paymentNotes, setPaymentNotes] = useState<string>("");

  const [overdueAccounts, setOverdueAccounts] = useState<OverdueAccount[]>([
    {
      id: 1,
      customer: "City Hospital",
      phone: "(555) 0126",
      deposit: "₨ 500.00",
      amount: "₨ 240.00",
      amountNumeric: 240,
      dueDate: "Aug 15, 2025",
      daysOverdue: "81 days",
      invoices: "INV-890, INV-891",
      priority: "high",
    },
    {
      id: 2,
      customer: "TechStart Inc",
      phone: "(555) 0127",
      deposit: "₨ 500.00",
      amount: "₨ 96.00",
      amountNumeric: 96,
      dueDate: "Oct 20, 2025",
      daysOverdue: "15 days",
      invoices: "INV-1120",
      priority: "medium",
    },
    {
      id: 3,
      customer: "Metro School",
      phone: "(555) 0145",
      deposit: "₨ 500.00",
      amount: "₨ 180.00",
      amountNumeric: 180,
      dueDate: "Sep 30, 2025",
      daysOverdue: "35 days",
      invoices: "INV-995, INV-1012",
      priority: "high",
    },
    {
      id: 4,
      customer: "John Doe",
      phone: "(555) 0123",
      deposit: "₨ 500.00",
      amount: "₨ 48.50",
      amountNumeric: 48.5,
      dueDate: "Oct 28, 2025",
      daysOverdue: "7 days",
      invoices: "INV-1234",
      priority: "low",
    },
  ]);

  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([
    {
      customer: "Green Valley Clinic",
      phone: "(555) 0189",
      deposit: "₨ 500.00",
      amount: "₨ 320.00",
      invoice: "INV-1245",
      paymentDate: "Nov 28, 2025",
      paymentMethod: "Bank Transfer",
      status: "completed",
    },
    {
      customer: "Sarah Johnson",
      phone: "(555) 0156",
      deposit: "₨ 500.00",
      amount: "₨ 75.50",
      invoice: "INV-1238",
      paymentDate: "Nov 27, 2025",
      paymentMethod: "Credit Card",
      status: "completed",
    },
    {
      customer: "Downtown Pharmacy",
      phone: "(555) 0178",
      deposit: "₨ 500.00",
      amount: "₨ 450.00",
      invoice: "INV-1232",
      paymentDate: "Nov 26, 2025",
      paymentMethod: "Cash",
      status: "completed",
    },
    {
      customer: "ABC Corporation",
      phone: "(555) 0192",
      deposit: "₨ 500.00",
      amount: "₨ 125.00",
      invoice: "INV-1228",
      paymentDate: "Nov 25, 2025",
      paymentMethod: "Bank Transfer",
      status: "pending",
    },
    {
      customer: "Michael Chen",
      phone: "(555) 0134",
      deposit: "₨ 500.00",
      amount: "₨ 89.00",
      invoice: "INV-1215",
      paymentDate: "Nov 23, 2025",
      paymentMethod: "Credit Card",
      status: "completed",
    },
  ]);

  const [ledgerEntries] = useState<LedgerEntry[]>([
    {
      customer: "City Hospital",
      phone: "(555) 0126",
      invoice: "INV-891",
      date: "Nov 15, 2025",
      description: "Medical Supplies - Q4",
      debit: "₨ 120.00",
      credit: "",
      balance: "₨ 240.00",
    },
    {
      customer: "City Hospital",
      phone: "(555) 0126",
      invoice: "INV-890",
      date: "Oct 28, 2025",
      description: "Medical Equipment",
      debit: "₨ 120.00",
      credit: "",
      balance: "₨ 120.00",
    },
    {
      customer: "Green Valley Clinic",
      phone: "(555) 0189",
      invoice: "INV-1245",
      date: "Nov 28, 2025",
      description: "Payment Received",
      debit: "",
      credit: "₨ 320.00",
      balance: "₨ 0.00",
    },
    {
      customer: "Green Valley Clinic",
      phone: "(555) 0189",
      invoice: "INV-1210",
      date: "Nov 10, 2025",
      description: "Laboratory Services",
      debit: "₨ 320.00",
      credit: "",
      balance: "₨ 320.00",
    },
    {
      customer: "TechStart Inc",
      phone: "(555) 0127",
      invoice: "INV-1120",
      date: "Oct 20, 2025",
      description: "Consulting Services",
      debit: "₨ 96.00",
      credit: "",
      balance: "₨ 96.00",
    },
    {
      customer: "Sarah Johnson",
      phone: "(555) 0156",
      invoice: "INV-1238",
      date: "Nov 27, 2025",
      description: "Payment Received",
      debit: "",
      credit: "₨ 75.50",
      balance: "₨ 0.00",
    },
  ]);

  const handleMakePayment = (account: OverdueAccount) => {
    setSelectedAccount(account);
    setPaymentAmount(account.amountNumeric.toString());
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = () => {
    if (!selectedAccount) {
      alert("No account selected");
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount)) {
      alert("Invalid payment amount");
      return;
    }

    const remaining = selectedAccount.amountNumeric - amount;

    // Add to recent payments
    const newPayment: RecentPayment = {
      customer: selectedAccount.customer,
      phone: selectedAccount.phone,
      deposit: selectedAccount.deposit,
      amount: `₨ ${amount.toFixed(2)}`,
      invoice: selectedAccount.invoices.split(",")[0]?.trim() || "N/A",
      paymentDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      paymentMethod: paymentMethod,
      status: "completed",
    };

    setRecentPayments([newPayment, ...recentPayments]);

    // Update or remove from overdue accounts
    if (remaining <= 0) {
      setOverdueAccounts(
        overdueAccounts.filter((acc) => acc.id !== selectedAccount.id)
      );
    } else {
      setOverdueAccounts(
        overdueAccounts.map((acc) =>
          acc.id === selectedAccount.id
            ? {
                ...acc,
                amount: `₨ ${remaining.toFixed(2)}`,
                amountNumeric: remaining,
              }
            : acc
        )
      );
    }

    // Reset and close modal
    setShowPaymentModal(false);
    setSelectedAccount(null);
    setPaymentAmount("");
    setPaymentNotes("");
  };

  const getPriorityColor = (priority: OverdueAccount["priority"]) => {
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

  const getStatusColor = (status: RecentPayment["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  <DollarSign className="mr-1 inline h-4 w-4" />
                  Total Revenue
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-900">₨ 15,670</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
            <div className="relative rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  <Check className="mr-1 inline h-4 w-4 text-green-600" />
                  Collected
                </p>
              </div>
              <p className="text-2xl font-bold text-green-600">₨ 13,220</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
            <div className="relative rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  <AlertCircle className="mr-1 inline h-4 w-4 text-red-600" />
                  Outstanding
                </p>
              </div>
              <p className="text-2xl font-bold text-red-600">₨2,450</p>
              <p className="text-xs text-red-600">18 overdue accounts</p>
            </div>
            <div className="relative rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
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

          {/* Tabs */}
          <div className="mb-6 flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overdue")}
              className={`relative flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors lg:px-6 ${activeTab === "overdue"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600"
                }`}
            >
              Overdue Accounts
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`relative flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors lg:px-6 ${activeTab === "payments"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600"
                }`}
            >
              Recent Payments
            </button>
            <button
              onClick={() => setActiveTab("ledger")}
              className={`relative flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors lg:px-6 ${activeTab === "ledger"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600"
                }`}
            >
              Accounts Ledger
            </button>
          </div>

          {/* Table Header Actions */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {activeTab === "overdue" && "Overdue Accounts"}
              {activeTab === "payments" && "Recent Payments"}
              {activeTab === "ledger" && "Accounts Ledger"}
            </h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-50">
                <Download size={16} />
                Export
              </button>
              {activeTab === "overdue" && (
                <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                  Send Reminders
                </button>
              )}
            </div>
          </div>

          {/* Overdue Accounts Table - Desktop */}
          {activeTab === "overdue" && (
            <div className="hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Customer
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Deposit Amount
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Amount Due
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Due Date
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Days Overdue
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Priority
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {overdueAccounts.map((account) => (
                      <tr key={account.id} className="border-t border-gray-200">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-500">
                              {account.phone}
                            </div>
                            <p className="font-medium text-gray-900">
                              {account.customer}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-medium text-red-600">
                            {account.deposit}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-medium text-red-600">
                            {account.amount}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-gray-900">{account.dueDate}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-medium text-orange-600">
                            {account.daysOverdue}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getPriorityColor(
                              account.priority
                            )}`}
                          >
                            {account.priority}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Phone size={16} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Mail size={16} />
                            </button>
                            <button
                              onClick={() => handleMakePayment(account)}
                              className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                            >
                              <CreditCard size={14} />
                              Pay
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
          )}

          {/* Recent Payments Table - Desktop */}
          {activeTab === "payments" && (
            <div className="hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Customer
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Deposit Amount
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Invoice
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Amount
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Payment Date
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Method
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((payment) => (
                      <tr key={payment.invoice} className="border-t border-gray-200">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-500">
                              {payment.phone}
                            </div>
                            <p className="font-medium text-gray-900">
                              {payment.customer}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm text-gray-600">
                            {payment.deposit}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm text-gray-600">
                            {payment.invoice}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-medium text-green-600">
                            {payment.amount}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-gray-900">{payment.paymentDate}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm text-gray-600">
                            {payment.paymentMethod}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Accounts Ledger Table - Desktop */}
          {activeTab === "ledger" && (
            <div className="hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Date
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Customer
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Invoice
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Description
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Debit
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Credit
                      </th>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerEntries.map((entry) => (
                      <tr key={entry.invoice} className="border-t border-gray-200">
                        <td className="px-6 py-5">
                          <p className="text-sm text-gray-900">{entry.date}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-medium text-gray-900">
                              {entry.customer}
                            </p>
                            <p className="text-xs text-gray-500">{entry.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm text-gray-600">
                            {entry.invoice}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm text-gray-600">
                            {entry.description}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-medium text-red-600">
                            {entry.debit || ""}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-medium text-green-600">
                            {entry.credit || ""}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-medium text-gray-900">
                            {entry.balance}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Overdue Accounts Cards - Mobile & Tablet */}
          {activeTab === "overdue" && (
            <div className="space-y-3 sm:space-y-4 lg:hidden">
              {overdueAccounts.map((account) => (
                <div
                  key={account.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {account.customer}
                      </h3>
                      <p className="text-xs text-gray-500">{account.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Deposit:</span>
                      <span className="text-sm text-gray-600">
                        {account.deposit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount Due:</span>
                      <span className="font-medium text-red-600">
                        {account.amount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-medium text-gray-900">
                        {account.dueDate}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Days Overdue:</span>
                      <span className="font-medium text-orange-600">
                        {account.daysOverdue}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Invoices:</span>
                      <span className="text-xs text-gray-500">
                        {account.invoices}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 text-sm">
                      <span className="text-gray-600">Priority:</span>
                      <span
                        className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getPriorityColor(
                          account.priority
                        )}`}
                      >
                        {account.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-gray-200 pt-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Phone size={16} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Mail size={16} />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMakePayment(account)}
                          className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                        >
                          <CreditCard size={14} />
                          Pay
                        </button>
                        <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">
                          <PhoneCall size={14} />
                          Follow Up
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent Payments Cards - Mobile & Tablet */}
          {activeTab === "payments" && (
            <div className="space-y-3 sm:space-y-4 lg:hidden">
              {recentPayments.map((payment) => (
                <div
                  key={payment.invoice}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {payment.customer}
                      </h3>
                      <p className="text-xs text-gray-500">{payment.phone}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </div>
                  <div className="space-y-2 border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Deposit:</span>
                      <span className="text-sm text-gray-600">
                        {payment.deposit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Invoice:</span>
                      <span className="text-sm text-gray-600">
                        {payment.invoice}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-green-600">
                        {payment.amount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Date:</span>
                      <span className="font-medium text-gray-900">
                        {payment.paymentDate}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Method:</span>
                      <span className="text-sm text-gray-600">
                        {payment.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Accounts Ledger Cards - Mobile & Tablet */}
          {activeTab === "ledger" && (
            <div className="space-y-3 sm:space-y-4 lg:hidden">
              {ledgerEntries.map((entry) => (
                <div
                  key={entry.invoice}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {entry.customer}
                      </h3>
                      <p className="text-xs text-gray-500">{entry.phone}</p>
                    </div>
                    <p className="text-xs text-gray-500">{entry.date}</p>
                  </div>
                  <div className="space-y-2 border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Invoice:</span>
                      <span className="text-sm text-gray-600">
                        {entry.invoice}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Description:</span>
                      <span className="text-sm text-gray-600">
                        {entry.description}
                      </span>
                    </div>
                    {entry.debit && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Debit:</span>
                        <span className="font-medium text-red-600">
                          {entry.debit}
                        </span>
                      </div>
                    )}
                    {entry.credit && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Credit:</span>
                        <span className="font-medium text-green-600">
                          {entry.credit}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-2 text-sm">
                      <span className="font-medium text-gray-600">Balance:</span>
                      <span className="font-medium text-gray-900">
                        {entry.balance}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedAccount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Record Payment
                </h2>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedAccount(null);
                    setPaymentAmount("");
                    setPaymentNotes("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                  <h3 className="font-medium text-gray-900">
                    {selectedAccount.customer}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedAccount.phone}</p>
                  <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
                    <span className="text-sm text-gray-600">Amount Due:</span>
                    <span className="font-semibold text-red-600">
                      {selectedAccount.amount}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Payment Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        ₨
                      </span>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        step="0.01"
                        className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Bank Transfer</option>
                      <option>Credit Card</option>
                      <option>Cash</option>
                      <option>Check</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Add payment notes..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedAccount(null);
                      setPaymentAmount("");
                      setPaymentNotes("");
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitPayment}
                    className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                  >
                    Record Payment
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