"use client";

import React, { useEffect, useState } from "react";
import { X, Box, Package, Save } from "lucide-react";
import { useProducts, useCreateInventory } from "@/lib/api/servicesHooks";
import { useProductStore } from "@/lib/store/useProduct";

interface AddQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  productId: string;
  quantity: string;
}

interface Errors {
  [key: string]: string;
}

export default function AddQuantityModal({
  isOpen,
  onClose,
  onSuccess,
}: AddQuantityModalProps) {
  if (!isOpen) return null;

  useProducts();
  const products = useProductStore((state) => state.state.products);

  const createInventoryMutation = useCreateInventory();

  const [formData, setFormData] = useState<FormData>({
    productId: "",
    quantity: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.productId) newErrors.productId = "Product is required";
    if (!formData.quantity.trim()) newErrors.quantity = "Quantity is required";
    else if (parseInt(formData.quantity) <= 0)
      newErrors.quantity = "Quantity must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await createInventoryMutation.mutateAsync({
        productId: formData.productId,
        quantity: parseInt(formData.quantity, 10),
      });

      setFormData({ productId: "", quantity: "" });
      onSuccess?.();
      onClose();
    } catch (error: any) {
      alert(error.message || "Failed to add quantity. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProduct = products.find((p) => p.id === formData.productId);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-boxdark shadow-xl relative">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-strokedark">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={22} />
          </button>

          <h2 className="text-xl font-semibold text-black dark:text-white">
            Add Inventory Quantity
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select a product and enter the quantity to add
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="space-y-5">

            {/* Product Dropdown */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Product
              </label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleSelectChange}
                className={`w-full rounded-lg border ${
                  errors.productId 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-stroke dark:border-form-strokedark focus:border-primary"
                } bg-transparent py-3 px-4 text-black dark:text-white outline-none transition`}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.size} (₨{product.price})
                  </option>
                ))}
              </select>
              {errors.productId && (
                <p className="mt-1.5 text-sm text-red-500">{errors.productId}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Enter quantity"
                className={`w-full rounded-lg border ${
                  errors.quantity 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-stroke dark:border-form-strokedark focus:border-primary"
                } bg-transparent py-3 px-4 text-black dark:text-white outline-none transition placeholder:text-gray-400`}
              />
              {errors.quantity && (
                <p className="mt-1.5 text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-meta-4 border-t border-gray-200 dark:border-strokedark rounded-b-xl flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-white font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Save size={18} />
            {isSubmitting ? "Adding..." : "Add to Inventory"}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-stroke dark:border-strokedark text-black dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-meta-4 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}