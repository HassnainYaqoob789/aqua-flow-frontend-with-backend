"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Tag,
  Building2,
  Hash,
  StickyNote,
  Save,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

type Category = "" | "Payroll" | "Utilities" | "Bottle Washing" | "Fuel & Transport" | "Vehicle Maintenance" | "Rent & Lease" | "Marketing" | "Office Supplies" | "Other";

type PaymentMethod = "" | "Cash" | "Card" | "Bank Transfer" | "Mobile Wallet";

interface FormData {
  category: Category;
  description: string;
  amount: string;
  date: string;
  paymentMethod: PaymentMethod;
  vendor: string;
  referenceNumber: string;
  notes: string;
}

interface Errors {
  [key: string]: string;
}

export default function AddExpense() {
  const [formData, setFormData] = useState<FormData>({
    category: "",
    description: "",
    amount: "",
    date: "",
    paymentMethod: "",
    vendor: "",
    referenceNumber: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value as any }));  // Quick cast for empty string, but types allow it now
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Valid amount is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Payment method is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Expense Data:", formData);
      alert("Expense added successfully! (Check console for data)");
      setFormData({
        category: "",
        description: "",
        amount: "",
        date: "",
        paymentMethod: "",
        vendor: "",
        referenceNumber: "",
        notes: "",
      });
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Add New Expense"
        description="Fill in the details below to record a new expense"
      />

      {/* Header with Back Button */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200 dark:bg-meta-4 dark:text-white dark:hover:bg-meta-3"
        >
          <ArrowLeft size={20} />
          <span>Back to Expenses</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="rounded-sm border border-stroke bg-white px-6 py-8 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              <Tag className="mr-2 inline h-4 w-4" />
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full rounded-lg border ${
                errors.category ? "border-red-500" : "border-stroke"
              } bg-transparent px-4 py-2 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
            >
              <option value="">Select category</option>
              <option value="Payroll">Payroll</option>
              <option value="Utilities">Utilities</option>
              <option value="Bottle Washing">Bottle Washing</option>
              <option value="Fuel & Transport">Fuel & Transport</option>
              <option value="Vehicle Maintenance">Vehicle Maintenance</option>
              <option value="Rent & Lease">Rent & Lease</option>
              <option value="Marketing">Marketing</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              <FileText className="mr-2 inline h-4 w-4" />
              Description *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Electricity Bill - November"
              className={`w-full rounded-lg border ${
                errors.description ? "border-red-500" : "border-stroke"
              } bg-transparent px-4 py-2 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <DollarSign className="mr-2 inline h-4 w-4" />
                Amount ($) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full rounded-lg border ${
                  errors.amount ? "border-red-500" : "border-stroke"
                } bg-transparent px-4 py-2 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.amount && (
                <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <Calendar className="mr-2 inline h-4 w-4" />
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.date ? "border-red-500" : "border-stroke"
                } bg-transparent px-4 py-2 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-red-500">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              <CreditCard className="mr-2 inline h-4 w-4" />
              Payment Method *
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className={`w-full rounded-lg border ${
                errors.paymentMethod ? "border-red-500" : "border-stroke"
              } bg-transparent px-4 py-2 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
            >
              <option value="">Select method</option>
              <option value="Cash">Cash</option>
              <option value="Card">Credit/Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Mobile Wallet">Mobile Wallet</option>
            </select>
            {errors.paymentMethod && (
              <p className="mt-1 text-xs text-red-500">
                {errors.paymentMethod}
              </p>
            )}
          </div>

          {/* Vendor/Payee */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              <Building2 className="mr-2 inline h-4 w-4" />
              Vendor/Payee
            </label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              placeholder="e.g., City Power Company"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          {/* Reference Number */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              <Hash className="mr-2 inline h-4 w-4" />
              Reference Number
            </label>
            <input
              type="text"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              placeholder="Invoice or reference number"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              <StickyNote className="mr-2 inline h-4 w-4" />
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes..."
              rows={3}
              className="w-full resize-none rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500"
            >
              <Save size={20} />
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}