// app/products/form/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Save } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useCreateProducts } from "@/lib/api/servicesHooks";
import imageCompression from "browser-image-compression";

interface FormData {
    name: string;
    size: string;
    category: "water" | "milk";
    price: number;
    description: string;
    isReusable: boolean;
    depositAmount: string;
    requiresEmptyReturn: boolean;
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
        isReusable: false,
        depositAmount: "",
        requiresEmptyReturn: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({});
    const [isCompressing, setIsCompressing] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsCompressing(true);

        try {
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
                fileType: 'image/jpeg' as const,
            };

            const compressedFile = await imageCompression(file, options);
            const previewUrl = URL.createObjectURL(compressedFile);

            setImageFile(compressedFile);
            setImagePreview(previewUrl);
        } catch (error) {
            console.error("Error compressing image:", error);
            alert("Failed to compress image. Please try another image.");
        } finally {
            setIsCompressing(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (type === "checkbox") {
            if (name === "isReusable") {
                setFormData((prev) => ({
                    ...prev,
                    [name]: checked,
                    requiresEmptyReturn: checked ? true : prev.requiresEmptyReturn,
                    depositAmount: checked ? prev.depositAmount : "",
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [name]: checked,
                }));
            }
        } else if (name === "price") {
            // Handle price specifically: convert to number, default to 0 if empty
            const numValue = value === "" ? 0 : parseFloat(value);
            setFormData((prev) => ({
                ...prev,
                price: isNaN(numValue) ? 0 : numValue,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

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
        router.push("/products/all-products");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("size", formData.size);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("price", formData.price.toString());
        if (formData.description) {
            formDataToSend.append("description", formData.description);
        }
        if (imageFile) {
            formDataToSend.append("image", imageFile);
        }

        formDataToSend.append("isReusable", formData.isReusable.toString());
        if (formData.isReusable) {
            formDataToSend.append("depositAmount", formData.depositAmount);
            formDataToSend.append("requiresEmptyReturn", formData.requiresEmptyReturn.toString());
        }

        createProductsMutation.mutate(formDataToSend, { onSuccess });
    };

    const handleCancel = () => {
        router.back();
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview("");
    };

    const isPending = createProductsMutation.isPending || isCompressing;

    // Display value for price input: show nothing if 0, otherwise show the number
    const displayPriceValue = formData.price === 0 ? "" : formData.price;

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
                                value={displayPriceValue}
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
                    {/* Rest of the form remains unchanged */}
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

                    {/* Reusable Bottle Section */}
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
                        <label className="flex items-center gap-3 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                name="isReusable"
                                checked={formData.isReusable}
                                onChange={handleInputChange}
                                className="w-4 h-4"
                            />
                            <span className="font-semibold">Is the Product Reusable?</span>
                        </label>

                        {formData.isReusable && (
                            <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-600 space-y-4">
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-black dark:text-white">
                                        Security Deposit Amount (PKR) *
                                    </label>
                                    <input
                                        type="number"
                                        name="depositAmount"
                                        placeholder="e.g. 500"
                                        value={formData.depositAmount}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 text-sm border ${errors.depositAmount ? "border-red-500" : "border-blue-300"
                                            } rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:border-blue-600`}
                                    />
                                    {errors.depositAmount && (
                                        <p className="mt-1 text-xs text-red-500">{errors.depositAmount}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                            Product Image
                        </label>
                        <div
                            className="border border-dashed border-gray-400 dark:border-strokedark rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition"
                            onClick={() => !isCompressing && document.getElementById("imageUploader")?.click()}
                        >
                            {isCompressing ? (
                                <div className="text-gray-500 dark:text-gray-400">
                                    <p className="text-sm">Compressing image...</p>
                                </div>
                            ) : imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-32 w-32 object-cover rounded-lg border shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage();
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
                                        <p className="text-xs mt-2 text-gray-400">Image will be compressed automatically</p>
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
                            disabled={isCompressing}
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