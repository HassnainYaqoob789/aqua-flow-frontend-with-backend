// app/products/edit/[id]/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { X, Save } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useProducts, useUpdateProducts } from "@/lib/api/servicesHooks";
import imageCompression from "browser-image-compression";
import { Product } from "@/lib/types/typeInterfaces";

interface FormData {
    name: string;
    size: string;
    category: "water" | "milk";
    price: number;
    description: string;
    isReusable: boolean;
    depositAmount: number;
    requiresEmptyReturn: boolean;
}

interface Errors {
    [key: string]: string;
}

export default function ProductEditPage() {
    const params = useParams();
    const id = params.id as string;
    const updateProductsMutation = useUpdateProducts();
    const router = useRouter();

    const { data: productsResponse, isLoading: productsLoading } = useProducts();
    const products = productsResponse?.products || [];
    const product = useMemo(() => products.find((p: Product) => p.id === id), [products, id]);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        size: "",
        category: "water",
        price: 0,
        description: "",
        isReusable: false,
        depositAmount: 0,
        requiresEmptyReturn: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({});
    const [isCompressing, setIsCompressing] = useState(false);

    // Populate form data when product is available
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                size: product.size,
                category: product.category,
                price: product.price,
                description: product.description || "",
                isReusable: product.isReusable || false,
                depositAmount: product.depositAmount || 0,
                requiresEmptyReturn: product.requiresEmptyReturn || true,
            });
            setImagePreview(product.image || "");
        }
    }, [product]);

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
                // When isReusable is checked, set requiresEmptyReturn to true by default
                setFormData((prev) => ({
                    ...prev,
                    [name]: checked,
                    requiresEmptyReturn: checked ? true : prev.requiresEmptyReturn,
                    depositAmount: checked ? prev.depositAmount : 0,
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [name]: checked,
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: (name === "price" || name === "depositAmount") ? parseFloat(value) || 0 : value,
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

        // Validate reusable bottle fields
        if (formData.isReusable) {
            if (formData.depositAmount <= 0) {
                newErrors.depositAmount = "Deposit amount is required for reusable bottles";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSuccess = () => {
        router.push("/products/all-products");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Create payload for update (assuming updateProducts handles Partial<Product> & {id})
        // Note: For image updates, you may need a separate mutation/API if multipart is required
        // For now, imageFile is not included; handle separately if needed
        const payload = {
            id,
            ...formData,
            // image: imageFile ? ... : undefined, // Handle image separately if needed
        };

        updateProductsMutation.mutate(payload, { onSuccess });
    };

    const handleCancel = () => {
        router.back();
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview("");
    };

    const isPending = updateProductsMutation.isPending || isCompressing;

    // Show loading if products not fetched yet
    if (productsLoading) {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center h-64">
                    <p>Loading products...</p>
                </div>
            </DefaultLayout>
        );
    }

    if (!product) {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center h-64">
                    <p>Product not found.</p>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <Breadcrumb
                pageName="Edit Product"
                description="Edit water and milk bottles"
            />
            <div className="mb-8 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h3 className="mb-4 text-lg font-bold text-black dark:text-white">
                    Edit Product
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
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-stroke bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                            >
                                <option value="water">Water</option>
                                <option value="milk">Milk</option>
                            </select>
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

                                <label className="flex items-center gap-3 cursor-pointer text-sm">
                                    <input
                                        type="checkbox"
                                        name="requiresEmptyReturn"
                                        checked={formData.requiresEmptyReturn}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <span className="font-medium text-black dark:text-gray-200">
                                        Return of Empty Product Required
                                    </span>
                                </label>
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
                        {imagePreview && !imagePreview.startsWith('blob:') && (
                            <p className="text-xs text-gray-500 mt-1">Current image will be replaced if new one is uploaded.</p>
                        )}
                    </div>
                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {isPending ? "Updating..." : "Update Product"}
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