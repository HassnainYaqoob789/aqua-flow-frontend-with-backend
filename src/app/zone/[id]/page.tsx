"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  MapPin,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { useCreateZone, useUpdateZone } from "@/lib/api/servicesHooks";
import { useZoneStore } from "@/lib/store/useZoneStore";
import { Zone } from "@/lib/types/typeInterfaces";

interface ZoneFormData {
  name: string;
  description: string;
}

export default function ZoneFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string; 

  const isCreateMode = id === "new";

  const [formData, setFormData] = useState<ZoneFormData>({
    name: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);

  const createZoneMutation = useCreateZone();
  const updateZoneMutation = useUpdateZone();

  const { state } = useZoneStore(); 

  useEffect(() => {
    if (!isCreateMode) {
      const zone = state.zone.find((z) => z.id === id);
      if (zone) {
        setFormData((prev) => ({
          ...prev,
          name: zone.name ?? "",
          description: zone.description ?? "",
        }));
      } else {
        console.warn(`Zone with ID ${id} not found in store.`);
      }
    }
  }, [id, isCreateMode, state.zone]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setError(null);

    if (isCreateMode) {
      createZoneMutation.mutate(
        {
          ...formData,
        },
        {
          onSuccess: () => {
            router.push("/zone/all-zone");
          },
          onError: (err: any) => {
            setError(err.response?.data?.message || err.message || "Failed to create zone. Please try again.");
          },
        }
      );
    } else {
      updateZoneMutation.mutate(
        {
          id,
          ...formData,
        },
        {
          onSuccess: () => {
            router.push("/zone/all-zone");
          },
          onError: (err: any) => {
            setError(err.response?.data?.message || err.message || "Failed to update zone. Please try again.");
          },
        }
      );
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={isCreateMode ? "Create New Zone" : "Edit Zone"}
        description={isCreateMode ? "Add a new delivery zone for driver routes" : "Update the zone details"}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
        <div className="mx-auto max-w-2xl px-3 sm:px-6">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/zone/all-zone"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Zones
            </Link>
          </div>

          {/* Form Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              {isCreateMode ? "New Zone Details" : "Edit Zone Details"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="e.g., Covers Lahore North"
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 px-3 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-400"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4">
                <Link
                  href="/zone/all-zone"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={createZoneMutation.isPending || updateZoneMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {(createZoneMutation.isPending || updateZoneMutation.isPending) ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                      {isCreateMode ? "Creating..." : "Updating..."}
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {isCreateMode ? "Create Zone" : "Update Zone"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}