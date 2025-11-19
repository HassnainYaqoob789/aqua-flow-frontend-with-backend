// src/app/order/add-order/page.tsx
"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  User,
  DollarSign,
  CreditCard,
  Truck,
  Save,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { useCustomers, useDriver, useProducts } from "@/lib/api/servicesHooks";
import { IMG_URL } from "@/lib/api/services/endpoints";
import { useProductStore } from "@/lib/store/useProduct";
import { useCustomerStore } from "@/lib/store/useCustomerStore";
import { useDriverStore } from "@/lib/store/useDriver";
import { useCreateOrder } from "@/lib/api/servicesHooks";
import { CreateOrderPayload } from "@/lib/types/auth";

interface OrderItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

interface FormData {
  customer: string;
  address: string;
  items: OrderItem[];
  date: string;           // Only delivery date
  driver: string;
  zoneId: string;
  amount: string;
  payment: "COD";
}

interface Errors {
  [key: string]: string;
}

export default function AddOrder() {
  const router = useRouter();

  const createOrderMutation = useCreateOrder();

  useProducts();
  const products = useProductStore((state) => state.state.products);

  useCustomers();
  const customers = useCustomerStore((state) => state.state.customers);

  useDriver();
  const drivers = useDriverStore((state) => state.state.drivers);

  const [formData, setFormData] = useState<FormData>({
    customer: "",
    address: "",
    items: [],
    date: "",
    driver: "",
    zoneId: "",
    amount: "0",
    payment: "COD",
  });

  const [errors, setErrors] = useState<Errors>({});

  // Auto-calculate total amount
  useEffect(() => {
    const total = formData.items
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
    setFormData((prev) => ({ ...prev, amount: total }));
  }, [formData.items]);

  const handleProductClick = (product: any) => {
    const existing = formData.items.find((i) => i.id === product.id);
    if (existing) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }));
    } else {
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
            image: product.image,
          },
        ],
      }));
    }
  };

  const getProductQuantity = (productId: string): number => {
    const item = formData.items.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items
        .map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        )
        .filter((i) => i.quantity > 0),
    }));
  };

  const handleRemoveItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCustomerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    const selectedCustomer = customers.find((c) => c.id === customerId);

    setFormData((prev) => ({
      ...prev,
      customer: customerId,
      zoneId: selectedCustomer?.zone?.id || "",
      address: selectedCustomer?.address || "",
      driver: "", // reset driver when customer changes
    }));

    setErrors((prev) => ({
      ...prev,
      customer: "",
      zoneId: "",
      address: "",
      driver: "",
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.customer) newErrors.customer = "Customer is required";
    if (!formData.zoneId) newErrors.zoneId = "Zone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (formData.items.length === 0) newErrors.items = "Add at least one product";
    if (!formData.date) newErrors.date = "Delivery date is required";
    if (!formData.driver) newErrors.driver = "Driver is required";

    const totalAmount = parseFloat(formData.amount);
    if (!totalAmount || totalAmount <= 0)
      newErrors.amount = "Total amount must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Optional: Warn user if they select Card/Wallet but backend doesn't support it yet
    if (formData.payment !== "COD") {
      const confirmProceed = confirm(
        "Card and Wallet payments are not yet supported. The order will be created as Cash on Delivery (COD). Continue?"
      );
      if (!confirmProceed) return;
    }

    try {
      const payload: CreateOrderPayload = {
        customerId: formData.customer,
        driverId: formData.driver,
        deliveryDate: formData.date, // YYYY-MM-DD → exactly what backend expects
        items: formData.items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        // Only include paymentMethod if it's COD (or force COD always)
        ...(formData.payment === "COD" && { paymentMethod: "cash_on_delivery" }),
      };

      console.log("Submitting order:", payload);

      await createOrderMutation.mutateAsync(payload);

      setTimeout(() => {
        router.push("/order/all-orders");
      }, 1000);

      // Reset form to initial state
      setFormData({
        customer: "",
        address: "",
        items: [],
        date: "",
        driver: "",
        zoneId: "",
        amount: "0",
        payment: "COD",
      });

      setErrors({}); // Clear any old errors
    } catch (err: any) {
      console.error("Order creation failed:", err);
      alert(err?.message || "Failed to create order. Please try again.");
    }
  };

  const totalItems = formData.items.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = parseFloat(formData.amount) || 0;

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add New Order
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create a new water delivery order
            </p>
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

          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              {/* Customer, Zone & Address */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4" /> Customer Name *
                  </label>
                  <select
                    name="customer"
                    value={formData.customer}
                    onChange={handleCustomerChange}
                    className={`w-full rounded-lg border ${errors.customer ? "border-red-500" : "border-gray-300"} bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                  >
                    <option value="">Select a customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.customer && (
                    <p className="mt-1 text-xs text-red-500">{errors.customer}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4" /> Zone *
                  </label>
                  <input
                    type="text"
                    value={
                      formData.customer
                        ? customers.find((c) => c.id === formData.customer)?.zone?.name ||
                        "No zone"
                        : ""
                    }
                    className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600"
                  />
                  {errors.zoneId && (
                    <p className="mt-1 text-xs text-red-500">{errors.zoneId}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4" /> Delivery Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, Karachi"
                    className={`w-full rounded-lg border ${errors.address ? "border-red-500" : "border-gray-300"} bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                  )}
                </div>
              </div>

              {/* Product Selection */}
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                <label className="mb-4 flex items-center gap-2 text-sm font-medium">
                  <Package className="h-4 w-4" /> Select Products *
                  <span className="text-xs text-gray-500">(Click to add)</span>
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {products.map((p) => {
                    const qty = getProductQuantity(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleProductClick(p)}
                        className={`relative flex flex-col items-center rounded-lg border p-3 transition-all hover:shadow-md ${qty > 0
                          ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                          : "border-gray-300 bg-white hover:border-blue-400 dark:border-gray-600 dark:bg-gray-800"
                          }`}
                      >
                        {qty > 0 && (
                          <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                            {qty}
                          </div>
                        )}
                        <img
                          src={`${IMG_URL}${p.image}`}
                          alt={p.name}
                          className="mb-2 h-12 w-12 object-contain"
                        />
                        <p className="text-xs font-medium">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.size}</p>
                        <p className="mt-1 text-sm font-semibold">
                          PKR {p.price.toFixed(2)}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {errors.items && (
                  <p className="mt-2 text-xs text-red-500">{errors.items}</p>
                )}

                {/* Selected Items Table */}
                {formData.items.length > 0 && (
                  <div className="mt-6 overflow-x-auto rounded-lg border dark:border-gray-700">
                    <table className="w-full">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="py-3 px-4 text-left text-sm font-medium">Product</th>
                          <th className="py-3 px-4 text-center text-sm font-medium">Qty</th>
                          <th className="py-3 px-4 text-center text-sm font-medium">Price</th>
                          <th className="py-3 px-4 text-center text-sm font-medium">Total</th>
                          <th className="py-3 px-4 text-center text-sm font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800">
                        {formData.items.map((item) => (
                          <tr key={item.id} className="border-b dark:border-gray-700">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={`${IMG_URL}${item.image}`}
                                  alt={item.name}
                                  className="h-8 w-8 rounded object-contain"
                                />
                                <div>
                                  <p className="text-sm font-medium">{item.name}</p>
                                  <p className="text-xs text-gray-500">{item.size}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  className="rounded bg-gray-200 p-1 hover:bg-gray-300 dark:bg-gray-700"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-12 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  className="rounded bg-gray-200 p-1 hover:bg-gray-300 dark:bg-gray-700"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              PKR {item.price.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-center font-medium text-blue-600 dark:text-blue-400">
                              PKR {(item.price * item.quantity).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t dark:border-gray-700">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount:</span>
                        <span>PKR {totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Total Items: {totalItems}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Date */}
              <div className="mt-6">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" /> Delivery Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full max-w-xs rounded-lg border ${errors.date ? "border-red-500" : "border-gray-300"} bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-red-500">{errors.date}</p>
                )}
              </div>

              {/* Driver & Amount */}
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Truck className="h-4 w-4" /> Driver *
                  </label>
                  {formData.zoneId ? (
                    <select
                      name="driver"
                      value={formData.driver}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${errors.driver ? "border-red-500" : "border-gray-300"} bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                    >
                      <option value="">Select driver</option>
                      {drivers
                        .filter((d) => d.zoneId === formData.zoneId)
                        .map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.vehicleId || "No Vehicle"}) - ⭐{d.rating || "N/A"}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <div className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-500 dark:bg-gray-700">
                      Select a customer first to see available drivers
                    </div>
                  )}
                  {errors.driver && (
                    <p className="mt-1 text-xs text-red-500">{errors.driver}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4" /> Total Amount (PKR)
                  </label>
                  <input
                    type="text"
                    value={totalAmount.toFixed(2)}
                    readOnly
                    className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-lg font-bold cursor-not-allowed dark:bg-gray-700 dark:border-gray-600"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Auto-calculated
                  </p>
                </div>

              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="h-4 w-4" /> Payment Method
                </label>
                <select
                  name="payment"
                  value={formData.payment}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="COD">Cash on Delivery</option>
                </select>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={createOrderMutation.isPending}
                className="mt-10 w-full flex items-center justify-center gap-3 rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                <Save size={22} />
                {createOrderMutation.isPending ? "Creating..." : "Create Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}