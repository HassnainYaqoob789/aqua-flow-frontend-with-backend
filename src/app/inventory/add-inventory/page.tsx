// app/inventory/add-quantity/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, Save } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useCreateCustomer, useCreateInventory } from "@/lib/api/servicesHooks";

interface FormData {
    quantity: string;
}

interface Errors {
    [key: string]: string;
}

export default function AddQuantityPage() {
    const createInventoryMutation = useCreateInventory();

    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
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

    const validateForm = (): boolean => {
        const newErrors: Errors = {};

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
            // Trigger the mutation with the quantity (convert to number)
            await createInventoryMutation.mutateAsync({
                // Adjust the payload according to your API expectations
                // Common patterns:
                quantity: parseInt(formData.quantity, 10),
                // OR if your API expects a different shape:
                // data: { quantity: parseInt(formData.quantity, 10) }
                // action: "add", etc.
            });

            // Success feedback
            alert(`Successfully added ${formData.quantity} units to inventory!`);

            // Reset form
            setFormData({ quantity: "" });

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
                        Enter the quantity you want to add
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Optional: Display Current Value */}
                {formData.quantity && !errors.quantity && (
                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">Preview:</span> You are adding{" "}
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                {formData.quantity}
                            </span>{" "}
                            units to inventory
                        </p>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
}