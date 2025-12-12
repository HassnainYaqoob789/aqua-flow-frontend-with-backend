// src/app/order/add-order/AddZoneModal.tsx
import React, { useState, FormEvent } from "react";
import { X, Building2, Save, MapPin } from "lucide-react";
import { useCreateZone } from "@/lib/api/servicesHooks";

export interface ZoneFormData {
    name: string;
    description: string;
}

interface AddZoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (newZoneId: string) => void;
    refetchZones: () => void;
}

export default function AddZoneModal({ isOpen, onClose, onSuccess, refetchZones }: AddZoneModalProps) {
    const createZoneMutation = useCreateZone();

    const [formData, setFormData] = useState<ZoneFormData>({
        name: "",
        description: "",
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError("Zone name is required.");
            return false;
        }
        if (!formData.description.trim()) {
            setError("Description is required.");
            return false;
        }
        return true;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        setError(null);

        createZoneMutation.mutate(
            {
                ...formData,
            },
            {
                onSuccess: (data: any) => {
                    console.log("Zone creation response:", data);

                    // Reset form
                    setFormData({ name: "", description: "" });
                    setError(null);

                    // Directly extract the zone ID
                    const newZoneId = data?.zone?.id ?? null;

                    console.log("Extracted zone ID:", newZoneId);
                    console.log("Extracted data:", data);

                    // Refetch zones
                    refetchZones();

                    if (onSuccess && newZoneId) {
                        onSuccess(newZoneId);
                    }

                    onClose();
                },
                onError: (err: any) => {
                    console.error("Zone creation error:", err);
                    setError(err.response?.data?.message || err.message || "Failed to create zone. Please try again.");
                },
            }
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 transform scale-95 transition-all duration-300 animate-in fade-in-0 zoom-in-95">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1C2434] shadow-lg">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Zone</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Create a new delivery zone</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={createZoneMutation.isPending}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:hover:text-white dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} id="zone-form" className="space-y-4">
                        {/* Zone Name Field */}
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-medium text-black dark:text-white">
                                Zone Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" size={18} />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., North Zone"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 text-sm outline-none placeholder:text-gray-500 focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="mb-2 block text-sm font-medium text-black dark:text-white">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="e.g., Covers Lahore North"
                                className="w-full rounded-lg border border-stroke bg-transparent py-2 px-4 text-sm outline-none placeholder:text-gray-500 focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 border-t border-gray-200 bg-white px-6 py-5 dark:border-gray-700 dark:bg-gray-800">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={createZoneMutation.isPending}
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="zone-form"
                        disabled={createZoneMutation.isPending}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1C2434] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#1C2434]/90 focus:outline-none focus:ring-2 focus:ring-[#1C2434]/20 transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {createZoneMutation.isPending ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Create Zone
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}