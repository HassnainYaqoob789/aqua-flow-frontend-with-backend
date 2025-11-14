// src/app/order/add-order/page.tsx
"use client";

import React, { useState, ChangeEvent } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import {
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  User,
  DollarSign,
  CreditCard,
  Clock,
  Truck,
  Save,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import {
  Water19L,
  Water10L,
  Water5L,
  Water1_5L,
  Water500mlPack,
  Milk1L,
  Milk2L,
  Milk500mlPack,
} from "@/components/icons/BottleSVG";

interface OrderItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  icon: React.ReactNode;
  price: number;
}

interface FormData {
  customer: string;
  address: string;
  items: OrderItem[];
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

const PRODUCTS = [
  { id: "water-19l", name: "Water Bottle", size: "19L", price: 5.99, icon: Water19L },
  { id: "water-10l", name: "Water Bottle", size: "10L", price: 3.49, icon: Water10L },
  { id: "water-5l", name: "Water Bottle", size: "5L", price: 2.49, icon: Water5L },
  { id: "water-1.5l", name: "Water Bottle", size: "1.5L", price: 1.49, icon: Water1_5L },
  { id: "water-500ml", name: "Water Bottle", size: "500ml (Pack of 6)", price: 2.99, icon: Water500mlPack },
  { id: "milk-1l", name: "Milk Bottle", size: "1L", price: 2.99, icon: Milk1L },
  { id: "milk-2l", name: "Milk Bottle", size: "2L", price: 4.99, icon: Milk2L },
  { id: "milk-500ml", name: "Milk Bottle", size: "500ml (Pack of 6)", price: 3.99, icon: Milk500mlPack },
];

export default function AddOrder() {
  const [formData, setFormData] = useState<FormData>({
    customer: "",
    address: "",
    items: [],
    date: "",
    time: "",
    driver: "",
    amount: "",
    payment: "COD",
    status: "Pending",
  });

  const [errors, setErrors] = useState<Errors>({});

  // Add product or increment quantity with single click
  const handleProductClick = (product: typeof PRODUCTS[0]) => {
    const existing = formData.items.find((i) => i.id === product.id);
    const Icon = product.icon;

    if (existing) {
      // Increment quantity
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }));
    } else {
      // Add new product with quantity 1
      setFormData((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            id: product.id,
            name: product.name,
            size: product.size,
            quantity: 1,
            price: product.price,
            icon: <Icon className="h-6 w-6" />,
          },
        ],
      }));
    }
  };

  // Get quantity for a product
  const getProductQuantity = (productId: string): number => {
    const item = formData.items.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0),
    }));
  };

  const handleRemoveItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.customer.trim()) newErrors.customer = "Customer name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (formData.items.length === 0) newErrors.items = "Add at least one product";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time.trim()) newErrors.time = "Time slot is required";
    if (!formData.driver.trim()) newErrors.driver = "Driver is required";
    if (!formData.amount || isNaN(Number(formData.amount)) || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Valid amount is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Order Created:", formData);
      alert("Order created successfully!");
      setFormData({
        customer: "",
        address: "",
        items: [],
        date: "",
        time: "",
        driver: "",
        amount: "",
        payment: "COD",
        status: "Pending",
      });
    }
  };

  const totalItems = formData.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <DefaultLayout>

      <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Order</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create a new water delivery order</p>
          </div>

          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              <ArrowLeft size={20} /> Back
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              {/* Customer & Address */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                    <User className="h-4 w-4" /> Customer Name *
                  </label>
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full rounded-lg border ${errors.customer ? "border-red-500" : "border-gray-300"} bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.customer && <p className="mt-1 text-xs text-red-500">{errors.customer}</p>}
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                    <MapPin className="h-4 w-4" /> Delivery Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, Karachi"
                    className={`w-full rounded-lg border ${errors.address ? "border-red-500" : "border-gray-300"} bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                </div>
              </div>

              {/* Product Grid */}
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                <label className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <Package className="h-4 w-4" /> Select Products * <span className="text-xs text-gray-500">(Click to add)</span>
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {PRODUCTS.map((p) => {
                    const Icon = p.icon;
                    const quantity = getProductQuantity(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleProductClick(p)}
                        className={`relative flex flex-col items-center rounded-lg border p-3 transition-all hover:shadow-md ${quantity > 0
                            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                            : "border-gray-300 bg-white hover:border-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-blue-500"
                          }`}
                      >
                        {/* Quantity Badge */}
                        {quantity > 0 && (
                          <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-lg">
                            {quantity}
                          </div>
                        )}
                        <Icon className="mb-2 h-12 w-12 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs font-medium text-gray-900 dark:text-white">{p.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{p.size}</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">PKR {p.price.toFixed(2)}</p>
                      </button>
                    );
                  })}
                </div>

                {errors.items && <p className="mt-2 text-xs text-red-500">{errors.items}</p>}

                {/* Selected Items */}
                {formData.items.length > 0 && (
                  <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="w-full">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 dark:text-white">Product</th>
                          <th className="py-3 px-4 text-center text-sm font-medium text-gray-900 dark:text-white">Quantity</th>
                          <th className="py-3 px-4 text-center text-sm font-medium text-gray-900 dark:text-white">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800">
                        {formData.items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {item.icon}
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.size}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  className="rounded bg-gray-200 p-1.5 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                  <Minus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                                </button>
                                <span className="w-10 text-center text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  className="rounded bg-gray-200 p-1.5 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                  <Plus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="bg-gray-50 p-3 text-right dark:bg-gray-900">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Total Items: {totalItems}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Date & Time */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                    <Calendar className="h-4 w-4" /> Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${errors.date ? "border-red-500" : "border-gray-300"} bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                    <Clock className="h-4 w-4" /> Time Slot *
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="time"
                      name="startTime"
                      // value={formData.startTime}
                      onChange={handleChange}
                      className={`w-1/2 rounded-lg border ${errors.startTime ? "border-red-500" : "border-gray-300"} bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                    />

                    <input
                      type="time"
                      name="endTime"
                      // value={formData.endTime}
                      onChange={handleChange}
                      className={`w-1/2 rounded-lg border ${errors.endTime ? "border-red-500" : "border-gray-300"} bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                    />
                  </div>

                  {(errors.startTime || errors.endTime) && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.startTime || errors.endTime}
                    </p>
                  )}
                </div>

              </div>

              {/* Driver & Amount */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                    <Truck className="h-4 w-4" /> Driver *
                  </label>
                  <input
                    type="text"
                    name="driver"
                    value={formData.driver}
                    onChange={handleChange}
                    placeholder="Ahmed Khan"
                    className={`w-full rounded-lg border ${errors.driver ? "border-red-500" : "border-gray-300"} bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.driver && <p className="mt-1 text-xs text-red-500">{errors.driver}</p>}
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                    <DollarSign className="h-4 w-4" /> Amount (PKR) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className={`w-full rounded-lg border ${errors.amount ? "border-red-500" : "border-gray-300"} bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
                </div>
              </div>

              {/* Payment */}
              <div className="mt-6">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <CreditCard className="h-4 w-4" /> Payment Method
                </label>
                <select
                  name="payment"
                  value={formData.payment}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="Card">Card</option>
                  <option value="Wallet">Wallet</option>
                </select>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
              >
                <Save size={20} /> Create Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>

  );
}