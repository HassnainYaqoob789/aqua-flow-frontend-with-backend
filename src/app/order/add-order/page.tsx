"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { ArrowLeft, Calendar, MapPin, Package, User, DollarSign, CreditCard, Clock, Truck, Save } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface FormData {
  customer: string;
  address: string;
  items: string;
  date: string;
  time: string;
  driver: string;
  amount: string;
  payment: "COD" | "Card" | "Wallet";
  status: "Pending";
}

interface Errors {
  [key: string]: string;
}

export default function AddOrder() {
  const [formData, setFormData] = useState<FormData>({
    customer: "",
    address: "",
    items: "",
    date: "",
    time: "",
    driver: "",
    amount: "",
    payment: "COD",
    status: "Pending", // Default status
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.customer.trim()) newErrors.customer = "Customer name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.items.trim()) newErrors.items = "Items details are required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time.trim()) newErrors.time = "Time slot is required";
    if (!formData.amount || isNaN(Number(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }
    if (!formData.driver.trim()) newErrors.driver = "Driver assignment is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate API call or add to orders list
      console.log("New Order Data:", formData);
      // Generate ID example: #${Date.now().toString().slice(-4)}
      alert("Order added successfully! (Check console for data)");
      // Reset form or redirect
      setFormData({
        customer: "",
        address: "",
        items: "",
        date: "",
        time: "",
        driver: "",
        amount: "",
        payment: "COD",
        status: "Pending",
      });
      setErrors({});
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Add New Order"
        description="Fill in the details to create a new water delivery order"
      />

      {/* Header with Back Button */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200 dark:bg-meta-4 dark:text-white dark:hover:bg-meta-3"
        >
          <ArrowLeft size={20} />
          <span>Back to Orders</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="rounded-sm border border-stroke bg-white px-6 py-8 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Section */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <User className="inline mr-2 h-4 w-4" />
                Customer Name *
              </label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                placeholder="Enter customer name"
                className={`w-full rounded-lg border ${
                  errors.customer ? "border-red-500" : "border-stroke"
                } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.customer && (
                <p className="mt-1 text-xs text-red-500">{errors.customer}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <MapPin className="inline mr-2 h-4 w-4" />
                Delivery Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                className={`w-full rounded-lg border ${
                  errors.address ? "border-red-500" : "border-stroke"
                } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-500">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Items Section */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              <Package className="inline mr-2 h-4 w-4" />
              Items Details *
            </label>
            <textarea
              name="items"
              value={formData.items}
              onChange={handleChange}
              placeholder="e.g., 2x 20L Bottles, 1x 10L Bottle"
              rows={2}
              className={`w-full rounded-lg border ${
                errors.items ? "border-red-500" : "border-stroke"
              } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary resize-none`}
            />
            {errors.items && (
              <p className="mt-1 text-xs text-red-500">{errors.items}</p>
            )}
          </div>

          {/* Date & Time Section */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <Calendar className="inline mr-2 h-4 w-4" />
                Delivery Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.date ? "border-red-500" : "border-stroke"
                } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-red-500">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <Clock className="inline mr-2 h-4 w-4" />
                Time Slot *
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g., 2:00 PM - 4:00 PM"
                className={`w-full rounded-lg border ${
                  errors.time ? "border-red-500" : "border-stroke"
                } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.time && (
                <p className="mt-1 text-xs text-red-500">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Driver & Amount Section */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <Truck className="inline mr-2 h-4 w-4" />
                Driver *
              </label>
              <input
                type="text"
                name="driver"
                value={formData.driver}
                onChange={handleChange}
                placeholder="Enter driver name or 'Unassigned'"
                className={`w-full rounded-lg border ${
                  errors.driver ? "border-red-500" : "border-stroke"
                } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.driver && (
                <p className="mt-1 text-xs text-red-500">{errors.driver}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <DollarSign className="inline mr-2 h-4 w-4" />
                Amount ($)*
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
                } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.amount && (
                <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              <CreditCard className="inline mr-2 h-4 w-4" />
              Payment Method *
            </label>
            <select
              name="payment"
              value={formData.payment}
              onChange={handleChange}
              className="w-full rounded-lg border border-stroke bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="Card">Credit/Debit Card</option>
              <option value="Wallet">Digital Wallet</option>
            </select>
          </div>

          {/* Status - Hidden or Readonly since default */}
          <input type="hidden" name="status" value={formData.status} />

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500"
            >
              <Save size={20} />
              Create Order
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}