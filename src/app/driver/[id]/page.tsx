"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { ArrowLeft, User, Phone, MapPin, Truck, Save, Hash } from "lucide-react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useZoneStore } from "@/lib/store/useZoneStore";
import { useDriverStore } from "@/lib/store/useDriver";
import { useZone, useCreateDriver, useUpdateDriver } from "@/lib/api/servicesHooks";
import { Zone } from "@/lib/types/typeInterfaces";
import { useRouter } from "next/navigation";

interface FormData {
  id: string;
  name: string;
  contact: string;
  zone: string;
  vehicleId: string;
}

interface Errors {
  [key: string]: string;
}

export default function DriverFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string; // "new" or actual driver id

  const isCreateMode = id === "new";

  const { data: dataaa, isLoading: zonesLoading, isError: zonesError } = useZone();
  const createDriverMutation = useCreateDriver();
  const updateDriverMutation = useUpdateDriver();

  const { state: zoneState } = useZoneStore();
  const zones = zoneState.zone || [];

  useEffect(() => {
    if (dataaa?.zones) {
      useZoneStore.getState().setState({ zone: dataaa.zones });
    }
  }, [dataaa]);

  const { state } = useDriverStore(); // Get the store state for prefill

  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    contact: "",
    zone: "",
    vehicleId: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill form with driver from store when in edit mode
  useEffect(() => {
    if (!isCreateMode) {
      const driver = state.drivers.find((d) => d.id === id);
      if (driver) {
        setFormData((prev) => ({
          ...prev,
          name: driver.name ?? "",
          contact: driver.contact ?? "",
          zone: driver.zoneId ?? "",
          vehicleId: driver.vehicleId ?? "",
          // Assuming 'id' in form is a custom field (e.g., employee ID) not in Driver interface;
          // if it's the system id, make it read-only and set to driver.id
          id: "", // Or driver.id if it's the same; adjust based on your schema
        }));
      } else {
        // Optional: Handle case where driver not found in store
        console.warn(`Driver with ID ${id} not found in store.`);
      }
    }
  }, [id, isCreateMode, state.drivers]);

  const getInitials = (name: string): string => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.id.trim()) {
      newErrors.id = "Driver ID is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Driver name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Driver name must be at least 3 characters";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.contact)) {
      newErrors.contact = "Please enter a valid contact number";
    }

    if (!formData.zone.trim()) {
      newErrors.zone = "Zone is required";
    }

    if (!formData.vehicleId.trim()) {
      newErrors.vehicleId = "Vehicle ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    // Create payload matching Driver interface / API requirements
    const basePayload = {
      name: formData.name,
      contact: formData.contact,
      vehicleId: formData.vehicleId,
      zoneId: formData.zone,
    };

    if (isCreateMode) {
      createDriverMutation.mutate(basePayload, {
        onSuccess: () => {
          router.push("/driver/all-driver-routes");
        },
        onError: (error: any) => {
          console.error("Driver creation failed:", error);
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to create driver. Please try again.";
          setError(errorMessage);
          setIsSubmitting(false);
        },
      });
    } else {
      updateDriverMutation.mutate(
        {
          id,
          ...basePayload,
        },
        {
          onSuccess: () => {
            router.push("/driver/all-driver-routes");
          },
          onError: (error: any) => {
            console.error("Driver update failed:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update driver. Please try again.";
            setError(errorMessage);
            setIsSubmitting(false);
          },
        }
      );
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={isCreateMode ? "Add New Driver" : "Edit Driver"}
        description={isCreateMode ? "Fill in the details to add a new driver to the fleet" : "Update the driver details"}
      />

      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.push("/driver/all-driver-routes")}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200 dark:bg-meta-4 dark:text-white dark:hover:bg-meta-3"
        >
          <ArrowLeft size={20} />
          <span>Back to Drivers</span>
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-6 py-8 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Driver ID & Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <Hash className="inline mr-2 h-4 w-4" />
                Driver ID *
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="e.g., DRV-001"
                className={`w-full rounded-lg border ${errors.id ? "border-red-500" : "border-stroke"
                  } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.id && <p className="mt-1 text-xs text-red-500">{errors.id}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <User className="inline mr-2 h-4 w-4" />
                Driver Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={`w-full rounded-lg border ${errors.name ? "border-red-500" : "border-stroke"
                  } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              {formData.name && !errors.name && (
                <p className="mt-1 text-xs text-gray-500">Initials: {getInitials(formData.name)}</p>
              )}
            </div>
          </div>

          {/* Contact & Zone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <Phone className="inline mr-2 h-4 w-4" />
                Contact Number *
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="e.g., +1 555-0201"
                className={`w-full rounded-lg border ${errors.contact ? "border-red-500" : "border-stroke"
                  } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.contact && <p className="mt-1 text-xs text-red-500">{errors.contact}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <MapPin className="inline mr-2 h-4 w-4" />
                Zone *
              </label>
              {zonesLoading ? (
                <div className="w-full rounded-lg border border-stroke bg-transparent py-2 px-4 text-sm text-gray-500">
                  Loading zones...
                </div>
              ) : zonesError ? (
                <div className="w-full rounded-lg border border-red-500 bg-transparent py-2 px-4 text-sm text-red-500">
                  Failed to load zones
                </div>
              ) : (
                <select
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${errors.zone ? "border-red-500" : "border-stroke"
                    } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                >
                  <option value="">Select Zone</option>
                  {zones.length > 0 &&
                    zones.map((zone: Zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                </select>
              )}
              {errors.zone && <p className="mt-1 text-xs text-red-500">{errors.zone}</p>}
            </div>
          </div>

          {/* Vehicle ID */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              <Truck className="inline mr-2 h-4 w-4" />
              Vehicle ID *
            </label>
            <input
              type="text"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              placeholder="e.g., TR-1234"
              className={`w-full rounded-lg border ${errors.vehicleId ? "border-red-500" : "border-stroke"
                } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
            />
            {errors.vehicleId && <p className="mt-1 text-xs text-red-500">{errors.vehicleId}</p>}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || createDriverMutation.isPending || updateDriverMutation.isPending || zonesLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isSubmitting || createDriverMutation.isPending || updateDriverMutation.isPending ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {isCreateMode ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>
                  <Save size={20} />
                  {isCreateMode ? "Create Driver" : "Update Driver"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}