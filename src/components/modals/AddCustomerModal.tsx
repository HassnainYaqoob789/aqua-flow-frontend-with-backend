// src/app/order/add-order/AddCustomerModal.tsx
import React, { useState, FormEvent, useEffect } from "react";
import { X, User, Mail, Phone, MapPin, Globe, Save, Building2 } from "lucide-react";
import { useCreateCustomer } from "@/lib/api/servicesHooks";
import { useZone } from "@/lib/api/servicesHooks";
import { Zone } from "@/lib/types/auth";
import { useToastStore } from "@/lib/store/toastStore";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  zoneId: string;
}

export default function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
  const createCustomerMutation = useCreateCustomer();
  const { data: zoneData, isLoading, isError } = useZone();

  const [zones, setZones] = useState<Zone[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    zoneId: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (zoneData?.zones) {
      setZones(zoneData.zones);
    }
  }, [zoneData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.zoneId.trim()) newErrors.zoneId = "Zone is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    createCustomerMutation.mutate(
      {
        ...formData,
      },
      {
        onSuccess: () => {
          useToastStore.getState().addToast("Customer added successfully!", "success");
          setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            postalCode: "",
            country: "",
            zoneId: "",
          });
          setErrors({});
          onClose();
        },
        onError: (err: any) => {
          useToastStore.getState().addToast(
            err?.response?.data?.message || err.message || "Failed to add customer",
            "error"
          );
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800 transform scale-95 transition-all duration-300 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
        {/* Modal Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Customer</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:text-white dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} id="customer-form" className="space-y-6">
            {/* Full Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  <User className="inline mr-2 h-4 w-4" />
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className={`w-full rounded-lg border ${errors.name ? "border-red-500" : "border-stroke"} bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  <Mail className="inline mr-2 h-4 w-4" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className={`w-full rounded-lg border ${errors.email ? "border-red-500" : "border-stroke"} bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  <Phone className="inline mr-2 h-4 w-4" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className={`w-full rounded-lg border ${errors.phone ? "border-red-500" : "border-stroke"} bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <MapPin className="inline mr-2 h-4 w-4" />
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full street address"
                className={`w-full rounded-lg border ${errors.address ? "border-red-500" : "border-stroke"} bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <Building2 className="inline mr-2 h-4 w-4" />
                Zone *
              </label>
              {isLoading ? (
                <p className="text-sm text-gray-500">Loading zones...</p>
              ) : isError ? (
                <p className="text-sm text-red-500">Failed to load zones</p>
              ) : (
                <select
                  name="zoneId"
                  value={formData.zoneId}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${errors.zoneId ? "border-red-500" : "border-stroke"} py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
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
              {errors.zoneId && <p className="mt-1 text-xs text-red-500">{errors.zoneId}</p>}
            </div>

            {/* City, Postal, Country */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className={`w-full rounded-lg border ${errors.city ? "border-red-500" : "border-stroke"} bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                />
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                  className={`w-full rounded-lg border ${errors.postalCode ? "border-red-500" : "border-stroke"} bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                />
                {errors.postalCode && <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  <Globe className="inline mr-2 h-4 w-4" />
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  className={`w-full rounded-lg border ${errors.country ? "border-red-500" : "border-stroke"} bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                />
                {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 flex gap-3 border-t border-gray-200 bg-white px-6 py-5 dark:border-gray-700 dark:bg-gray-800">
          <button
            type="button"
            onClick={onClose}
            disabled={createCustomerMutation.isPending}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="customer-form"
            disabled={createCustomerMutation.isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
          >
            {createCustomerMutation.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                Adding Customer...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Add Customer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}