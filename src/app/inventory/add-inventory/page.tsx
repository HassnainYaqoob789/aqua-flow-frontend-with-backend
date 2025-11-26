// app/inventory/add-quantity/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, Save, Box } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useCreateCustomer, useCreateInventory, useProducts } from "@/lib/api/servicesHooks";
import { useProductStore } from "@/lib/store/useProduct";

interface FormData {
    productId: string;
    quantity: string;
}

interface Errors {
    [key: string]: string;
}

export default function AddQuantityPage() {
    useProducts();
    const products = useProductStore((state) => state.state.products);
    console.log("Products in AddQuantityPage:", products);

    const createInventoryMutation = useCreateInventory();

    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        productId: "",
        quantity: "",
    });
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user selects
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Errors = {};

        if (!formData.productId) {
            newErrors.productId = "Product is required";
        }

        if (!formData.quantity.trim()) {
            newErrors.quantity = "Quantity is required";
        } else if (parseInt(formData.quantity) <= 0) {
            newErrors.quantity = "Quantity must be greater than 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Send payload with productId and quantity
            await createInventoryMutation.mutateAsync({
                productId: formData.productId,
                quantity: parseInt(formData.quantity, 10),
            });

            // Success feedback
            const selectedProduct = products.find(p => p.id === formData.productId);
            alert(`Successfully added ${formData.quantity} units of ${selectedProduct?.name || 'product'} to inventory!`);

            // Reset form
            setFormData({ productId: "", quantity: "" });

            // Optional: navigate back after success
            // router.push("/inventory");
            // or router.back();
        } catch (error: any) {
            console.error("Error adding quantity:", error);

            // Show user-friendly error (from server or fallback)
            const message =
                error?.message ||
                error?.response?.data?.message ||
                "Failed to add quantity. Please try again.";

            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    // Get selected product details for preview
    const selectedProduct = products.find(p => p.id === formData.productId);

    return (
        <DefaultLayout>
            <Breadcrumb
                pageName="Add Quantity"
                description="Add new quantity to inventory"
            />

            <div className="mb-6">
                <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                    <ArrowLeft size={20} /> Back
                </button>
            </div>

            <div className="rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-black dark:text-white">
                        Add New Quantity
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Select a product and enter the quantity you want to add
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Dropdown */}
                    <div className="max-w-md">
                        <label className="mb-3 flex items-center gap-2 text-base font-medium text-black dark:text-white">
                            <Box className="h-5 w-5 text-blue-600" />
                            Product *
                        </label>
                        <select
                            name="productId"
                            value={formData.productId}
                            onChange={handleSelectChange}
                            className={`w-full rounded-lg border ${errors.productId ? "border-red-500" : "border-stroke"
                                } bg-transparent py-4 px-5 text-lg outline-none focus:border-primary transition-colors dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                        >
                            <option value="">Select a product</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - {product.size} (₨{product.price})
                                </option>
                            ))}
                        </select>
                        {errors.productId && (
                            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                <span>⚠️</span>
                                {errors.productId}
                            </p>
                        )}
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Choose the product for which you want to add quantity
                        </p>
                    </div>

                    {/* Quantity Input */}
                    <div className="max-w-md">
                        <label className="mb-3 flex items-center gap-2 text-base font-medium text-black dark:text-white">
                            <Package className="h-5 w-5 text-blue-600" />
                            Quantity *
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            placeholder="Enter quantity (e.g., 100)"
                            min="1"
                            className={`w-full rounded-lg border ${errors.quantity ? "border-red-500" : "border-stroke"
                                } bg-transparent py-4 px-5 text-lg outline-none focus:border-primary transition-colors dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                        />
                        {errors.quantity && (
                            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                <span>⚠️</span>
                                {errors.quantity}
                            </p>
                        )}
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Enter a positive number for the quantity you want to add
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-white font-semibold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Save size={20} />
                            {isSubmitting ? "Adding..." : "Add Quantity"}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 rounded-lg bg-gray-400 px-8 py-3 text-white font-semibold hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Preview */}
                {formData.productId && formData.quantity && !errors.quantity && selectedProduct && (
                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">Preview:</span> You are adding{" "}
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                {formData.quantity}
                            </span>{" "}
                            units of{" "}
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                {selectedProduct.name}
                            </span>{" "}
                            to inventory
                        </p>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
}