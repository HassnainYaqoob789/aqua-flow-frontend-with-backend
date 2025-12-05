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
  Plus,
  Save,
  Minus,
  Trash2,
  Wallet,
  CheckSquare,
  X,
  UserPlus,
  Info,
} from "lucide-react";
import { useCustomers, useDriver, useProducts } from "@/lib/api/servicesHooks";
import { IMG_URL } from "@/lib/api/services/endpoints";
import { useProductStore } from "@/lib/store/useProduct";
import { useCustomerStore } from "@/lib/store/useCustomerStore";
import { useDriverStore } from "@/lib/store/useDriver";
import { useCreateOrder } from "@/lib/api/servicesHooks";
import { CreateOrderPayload, FormOrderItem, OrderItem } from "@/lib/types/auth";
import { useToastStore } from "@/lib/store/toastStore";
import AddCustomerModal from "@/components/modals/AddCustomerModal";

interface FormData {
  customer: string;
  address: string;
  items: FormOrderItem[];
  date: string;
  zoneId: string;
  amount: string;
  payment: "COD";
  depositAmountTaking: string;
  isRecurring: boolean;
  recurrence: string;
  preferredTime: string;
  selectedReusableProduct: string;
  withBottles: boolean;
}

interface Errors {
  [key: string]: string;
}

const FieldError = ({ error, id }: { error?: string; id: string }) => (
  error ? <p className="mt-1 text-xs text-red-500" id={`${id}-error`}>{error}</p> : null
);

const FieldHelper = ({ text, className = "" }: { text: string; className?: string }) => (
  <p className={`mt-1 text-xs text-gray-500 dark:text-gray-400 ${className}`}>
    <Info size={12} className="inline mr-1" />
    {text}
  </p>
);

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
    zoneId: "",
    amount: "0",
    payment: "COD",
    depositAmountTaking: "0",
    isRecurring: false,
    recurrence: "",
    preferredTime: "",
    selectedReusableProduct: "",
    withBottles: false,
  });

  const [errors, setErrors] = useState<Errors>({});

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate total deposit amount from selected products
  const calculateTotalDeposit = (items: FormOrderItem[]): number => {
    return items.reduce((sum, item) => sum + item.depositAmount * item.quantity, 0);
  };

  // Auto-calculate total amount (product prices + deposit amount taking)
  useEffect(() => {
    const productTotal = formData.items
      .reduce((sum, item) => sum + item.price * item.quantity, 0);

    const depositTaking = parseFloat(formData.depositAmountTaking) || 0;
    const total = (productTotal + depositTaking).toFixed(2);

    setFormData((prev) => ({ ...prev, amount: total }));
  }, [formData.items, formData.depositAmountTaking]);

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
            depositAmount: product.depositAmount || 0,
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

  const handleRecurringChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setFormData((prev) => ({ ...prev, isRecurring: isChecked }));
    if (!isChecked) {
      setFormData((prev) => ({ ...prev, recurrence: "", preferredTime: "" }));
      setErrors((prev) => {
        const { recurrence, preferredTime, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleWithBottlesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setFormData((prev) => ({ ...prev, withBottles: isChecked }));
  };

  const handleDepositTakingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || !isNaN(parseFloat(value))) {
      setFormData((prev) => ({ ...prev, depositAmountTaking: value }));
      if (errors.depositAmountTaking) {
        setErrors((prev) => ({ ...prev, depositAmountTaking: "" }));
      }
    }
  };

  const handleCustomerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    const selectedCustomer = customers.find((c) => c.id === customerId);

    setFormData((prev) => ({
      ...prev,
      customer: customerId,
      zoneId: selectedCustomer?.zone?.id || "",
      address: selectedCustomer?.address || "",
    }));

    setErrors((prev) => ({
      ...prev,
      customer: "",
      zoneId: "",
      address: "",
    }));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.customer) newErrors.customer = "Customer is required";
    if (!formData.zoneId) newErrors.zoneId = "Zone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (formData.items.length === 0) newErrors.items = "Add at least one product";
    if (!formData.date) newErrors.date = "Delivery date is required";

    const totalAmount = parseFloat(formData.amount);
    if (!totalAmount || totalAmount <= 0)
      newErrors.amount = "Total amount must be greater than 0";

    const depositTaking = parseFloat(formData.depositAmountTaking);
    const totalDeposit = calculateTotalDeposit(formData.items);
    if (totalDeposit > 0 && (isNaN(depositTaking) || depositTaking < 0)) {
      newErrors.depositAmountTaking = "Enter a valid deposit amount";
    }
    if (depositTaking > totalDeposit) {
      newErrors.depositAmountTaking = `Cannot exceed total deposit (PKR ${totalDeposit.toFixed(2)})`;
    }

    if (formData.isRecurring) {
      if (!formData.recurrence) newErrors.recurrence = "Recurrence pattern is required";
      if (!formData.preferredTime) newErrors.preferredTime = "Preferred time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (formData.payment !== "COD") {
      const confirmProceed = confirm(
        "Card and Wallet payments are not yet supported. The order will be created as Cash on Delivery (COD). Continue?"
      );
      if (!confirmProceed) return;
    }

    try {
      const depositTaking = parseFloat(formData.depositAmountTaking) || 0;

      const payload: CreateOrderPayload = {
        customerId: formData.customer,
        deliveryDate: formData.date,
        items: formData.items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        ...(formData.payment === "COD" && { paymentMethod: "cash_on_delivery" }),
        ...(depositTaking > 0 && { acceptableDepositAmount: depositTaking }),
        ...(formData.isRecurring && {
          isRecurring: true,
          recurrence: formData.recurrence,
          preferredTime: formData.preferredTime,
        }),
        withBottles: formData.withBottles,
      };

      await createOrderMutation.mutateAsync(payload);

      setFormData({
        customer: "",
        address: "",
        items: [],
        date: "",
        zoneId: "",
        amount: "0",
        payment: "COD",
        depositAmountTaking: "0",
        isRecurring: false,
        recurrence: "",
        preferredTime: "",
        selectedReusableProduct: "",
        withBottles: false,
      });

      setErrors({});
      useToastStore.getState().addToast("Order created successfully!", "success");

    } catch (err: any) {
      console.error("Order creation failed:", err);
      const message = err?.response?.data?.error || err?.message || "Failed to create order";
      useToastStore.getState().addToast(message, "error");
    }
  };

  const totalItems = formData.items.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = parseFloat(formData.amount) || 0;
  const totalDeposit = calculateTotalDeposit(formData.items);
  const productTotal = formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                  <div className="flex gap-2">
                    <select
                      name="customer"
                      value={formData.customer}
                      onChange={handleCustomerChange}
                      className={`flex-1 rounded-lg border ${errors.customer ? "border-red-500" : "border-gray-300"} bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                    >
                      <option value="">Select a customer</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="p-2 rounded-md hover:bg-[#1C2434]/20 transition-all"
                      title="Add New Customer"
                    >
                      <UserPlus className="h-5 w-5 text-[#1C2434]" />
                    </button>
                  </div>
                  <FieldError error={errors.customer} id="customer" />
                  <FieldHelper text="Select an existing customer or add a new one" />
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
                    readOnly
                  />
                  {errors.zoneId && (
                    <p className="mt-1 text-xs text-red-500">{errors.zoneId}</p>
                  )}
                  <FieldHelper text="Zone is automatically set based on selected customer" />
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
                  <FieldError error={errors.address} id="address" />
                  <FieldHelper text="Enter the full delivery address for the order" />
                </div>
              </div>

              {/* Order Settings Card */}
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Order Settings
                </h3>

                {/* RECURRING ORDER SECTION */}
                <div className="mb-4 space-y-2">
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.isRecurring}
                        onChange={handleRecurringChange}
                        className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span>Sales in a recurring order?</span>
                    </div>
                  </label>

                  {formData.isRecurring && !formData.selectedReusableProduct && (
                    <p className="text-sm text-red-500 mt-1 pl-7">
                      Please select a reusable product before enabling recurring orders.
                    </p>
                  )}
                  {/* <FieldHelper text="Enable for automated recurring deliveries based on pattern" className="pl-7" /> */}
                </div>

                {/* WITH BOTTLES CHECKBOX */}


                {/* RECURRING FIELDS */}
                {formData.isRecurring && (
                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Recurrence Pattern *
                      </label>
                      <select
                        name="recurrence"
                        value={formData.recurrence}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${errors.recurrence ? "border-red-500" : "border-gray-300"
                          } bg-white px-4 py-2 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
                      >
                        <option value="">Select recurrence</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="BI_WEEKLY">Bi-weekly</option>
                        <option value="MONTHLY">Monthly</option>
                      </select>

                      <FieldError error={errors.recurrence} id="recurrence" />
                      <FieldHelper text="How often should this order recur?" />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Preferred Delivery Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${errors.preferredTime ? "border-red-500" : "border-gray-300"
                          } bg-white px-4 py-2 text-sm focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
                      >
                        <option value="">Select time</option>
                        <option value="MORNING">Morning</option>
                        <option value="AFTERNOON">Afternoon</option>
                        <option value="EVENING">Evening</option>
                      </select>

                      <FieldError error={errors.preferredTime} id="preferredTime" />
                      <FieldHelper text="Preferred time slot for recurring deliveries" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.withBottles}
                          onChange={handleWithBottlesChange}
                          className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span>With Bottles</span>
                      </label>
                      <FieldHelper text="Include bottles with the delivery order" className="pl-7" />
                    </div>
                  </div>
                )}
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
                        {p.depositAmount && p.depositAmount > 0 && (
                          <p className="mt-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                            +PKR {p.depositAmount} deposit
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {errors.items && (
                  <p className="mt-2 text-xs text-red-500">{errors.items}</p>
                )}
                <FieldHelper text="Click on any product card to add it to the order. Quantity can be adjusted below." />

                {/* Selected Items Table */}
                {formData.items.length > 0 && (
                  <div className="mt-6 overflow-x-auto rounded-lg border dark:border-gray-700">
                    <table className="w-full">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="py-3 px-4 text-left text-sm font-medium">Product</th>
                          <th className="py-3 px-4 text-center text-sm font-medium">Qty</th>
                          <th className="py-3 px-4 text-center text-sm font-medium">Price</th>
                          <th className="py-3 px-4 text-center text-sm font-medium">Deposit</th>
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
                            <td className="py-3 px-4 text-center">
                              {item.depositAmount > 0 ? (
                                <span className="text-orange-600 dark:text-orange-400 font-medium">
                                  PKR {(item.depositAmount * item.quantity).toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
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
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Product Total:</span>
                          <span className="font-medium">PKR {productTotal.toFixed(2)}</span>
                        </div>
                        {totalDeposit > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Total Deposit Available:</span>
                            <span className="font-medium text-orange-600 dark:text-orange-400">
                              PKR {totalDeposit.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Total Items:</span>
                          <span>{totalItems}</span>
                        </div>
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
                <FieldError error={errors.date} id="date" />
                <FieldHelper text="Select the scheduled delivery date for this order" />
              </div>

              {/* Driver & Deposit Section */}
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {totalDeposit > 0 && (
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Wallet className="h-4 w-4" /> Total Deposit Amount (PKR)
                    </label>
                    <input
                      type="text"
                      value={totalDeposit.toFixed(2)}
                      readOnly
                      className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600"
                    />
                    <FieldHelper text="Auto-calculated from selected products" />
                  </div>
                )}
              </div>

              {/* Deposit Taking Amount */}
              {totalDeposit > 0 && (
                <div className="mt-6">
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4" /> Deposit Amount Taking (PKR) *
                    <span className="text-xs text-gray-500 font-normal">
                      (Max: PKR {totalDeposit.toFixed(2)})
                    </span>
                  </label>
                  <input
                    type="number"
                    name="depositAmountTaking"
                    value={formData.depositAmountTaking}
                    onChange={handleDepositTakingChange}
                    min="0"
                    max={totalDeposit}
                    step="0.01"
                    placeholder="0.00"
                    className={`w-full max-w-xs rounded-lg border ${errors.depositAmountTaking ? "border-red-500" : "border-gray-300"} bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                  />
                  <FieldError error={errors.depositAmountTaking} id="depositAmountTaking" />
                  <FieldHelper text="Enter the deposit amount you're collecting from the customer" />
                </div>
              )}

              {/* Total Amount */}
              <div className="mt-6">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-4 w-4" /> Total Amount (PKR)
                </label>
                <input
                  type="text"
                  value={totalAmount.toFixed(2)}
                  readOnly
                  className="w-full max-w-xs rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-lg font-bold cursor-not-allowed dark:bg-gray-700 dark:border-gray-600"
                />
                <FieldHelper text={`Product Total + Deposit Taking = PKR ${productTotal.toFixed(2)} + PKR ${parseFloat(formData.depositAmountTaking || "0").toFixed(2)}`} />
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
                  className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="COD">Cash on Delivery</option>
                </select>
                <FieldHelper text="Currently only Cash on Delivery is supported" />
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

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </DefaultLayout>
  );
}