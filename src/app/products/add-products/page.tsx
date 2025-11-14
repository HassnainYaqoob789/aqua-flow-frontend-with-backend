// app/products/form/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Save } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useCreateProducts } from "@/lib/api/servicesHooks";

interface Product {
    id: string;
    name: string;
    size: string;
    category: "water" | "milk";
    price: number;
    description?: string;
    image?: string; // NEW
}

interface FormData {
    name: string;
    size: string;
    category: "water" | "milk";
    price: number;
    description: string;
    image: string;
}

interface Errors {
    [key: string]: string;
}

export default function ProductFormPage() {
    const createProductsMutation = useCreateProducts();
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        name: "",
        size: "",
        category: "water",
        price: 0,
        description: "",
        image: "",
    });
    const [errors, setErrors] = useState<Errors>({});

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) || 0 : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Errors = {};
        if (!formData.name.trim()) newErrors.name = "Product name is required";
        if (!formData.size.trim()) newErrors.size = "Size is required";
        if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSuccess = () => {
        // router.push("/products");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            name: formData.name,
            size: formData.size,
            category: formData.category,
            price: formData.price,
            description: formData.description || undefined,
            image: formData.image || undefined,
        };

        createProductsMutation.mutate(payload, { onSuccess });
    };

    const handleCancel = () => {
        router.back();
    };

    const isPending = createProductsMutation.isPending;

    return (
        <DefaultLayout>
            <Breadcrumb
                pageName="Add Product"
                description="Add or edit water and milk bottles"
            />
            <div className="mb-8 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h3 className="mb-4 text-lg font-bold text-black dark:text-white">
                    Add New Product
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Water Bottle, Milk Bottle"
                                className={`w-full rounded-lg border ${errors.name ? "border-red-500" : "border-stroke"
                                    } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input`}
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                Size *
                            </label>
                            <input
                                type="text"
                                name="size"
                                value={formData.size}
                                onChange={handleInputChange}
                                placeholder="e.g., 19L, 500ml (Pack of 6)"
                                className={`w-full rounded-lg border ${errors.size ? "border-red-500" : "border-stroke"
                                    } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input`}
                            />
                            {errors.size && (
                                <p className="mt-1 text-xs text-red-500">{errors.size}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                Price (PKR) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className={`w-full rounded-lg border ${errors.price ? "border-red-500" : "border-stroke"
                                    } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input`}
                            />
                            {errors.price && (
                                <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Optional product description"
                            rows={2}
                            className="w-full rounded-lg border border-stroke bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input resize-none"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                            Product Image
                        </label>
                        <div
                            className="border border-dashed border-gray-400 dark:border-strokedark rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition"
                            onClick={() => document.getElementById("imageUploader")?.click()}
                        >
                            {formData.image ? (
                                <div className="relative">
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className="h-32 w-32 object-cover rounded-lg border shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFormData((prev) => ({ ...prev, image: "" }));
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="text-gray-500 dark:text-gray-400">
                                        <p className="text-sm mb-1">Drag & Drop Image Here</p>
                                        <p className="text-xs">or click to upload</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <input
                            id="imageUploader"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {isPending ? "Saving..." : "Add Product"}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isPending}
                            className="flex items-center gap-2 rounded-lg bg-gray-400 px-6 py-2 text-white font-medium hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X size={18} />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </DefaultLayout>
    );
}