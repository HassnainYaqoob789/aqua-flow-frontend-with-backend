"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { ArrowLeft, Mail, Phone, MapPin, User, Globe, Save, Plus, MapPinPlus } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useCreateCustomer, useCreateZone, useZone } from "@/lib/api/servicesHooks";
import { useZoneStore } from "@/lib/store/useZoneStore";
import { Zone } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import AddZoneModal from "@/components/modals/AddZoneModal";

interface ZoneFormData {
  name: string;
  description: string;
}

export default function AddCustomer() {
  const router = useRouter();
  const createCustomerMutation = useCreateCustomer();
  const { data: dataaa, isLoading, isError, refetch: refetchZones } = useZone();
  const zones = useZoneStore((s) => s.state.zone) || [];
  const activeZones = zones.filter((z: Zone) => z.status === "active");

  const setZones = (zonesArray: Zone[]) =>
    useZoneStore.getState().setState({ zone: zonesArray });


  useEffect(() => {
    if (dataaa?.zones) {
      useZoneStore.getState().setState({ zone: dataaa.zones });
    }
  }, [dataaa]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    zoneId: "",
  });

  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pendingZoneId, setPendingZoneId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  useEffect(() => {
    if (pendingZoneId && zones.length > 0) {
      const zoneExists = zones.some((zone: Zone) => zone.id === pendingZoneId);
      if (zoneExists) {
        console.log("Setting zone to:", pendingZoneId);
        setFormData((prev) => ({
          ...prev,
          zoneId: pendingZoneId,
        }));
        setPendingZoneId(null);
        if (errors.zoneId) {
          setErrors((prev) => ({ ...prev, zoneId: "" }));
        }
      }
    }
  }, [zones, pendingZoneId]);

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
          router.push("/customer/all-customers");
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
        },
        onError: (err: any) => {
          alert(`Failed to add customer: ${err.response?.data?.message || err.message}`);
        },
      }
    );
  };

  const handleZoneCreated = async (newZoneId: string) => {
    setPendingZoneId(newZoneId);
    await refetchZones();
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Add New Customer"
        description="Fill in the details to create a new customer profile"
      />

      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200 dark:bg-meta-4 dark:text-white dark:hover:bg-meta-3"
        >
          <ArrowLeft size={20} />
          <span>Back to Customers</span>
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-6 py-8 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                <MapPin className="inline mr-2 h-4 w-4" />
                Zone *
              </label>
              <div className="flex gap-2">
                {isLoading ? (
                  <p className="text-sm text-gray-500">Loading zones...</p>
                ) : isError ? (
                  <p className="text-sm text-red-500">Failed to load zones</p>
                ) : (
                  <>
                    <select
                      name="zoneId"
                      value={formData.zoneId}
                      onChange={handleChange}
                      className={`flex-1 rounded-lg border ${errors.zoneId ? "border-red-500" : "border-stroke"
                        } py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                    >
                      <option value="">Select Zone</option>

                      {activeZones.length > 0 &&
                        activeZones.map((zone: Zone) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name}
                          </option>
                        ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setIsZoneModalOpen(true)}
                      className="flex h-10 items-center justify-center rounded-lg bg-[#1C2434] px-3 text-white transition-colors hover:bg-[#1C2434]/80"
                      title="Add New Zone"
                    >
                      <MapPinPlus size={16} className="text-white" />
                    </button>
                  </>
                )}
              </div>
              {errors.zoneId && <p className="mt-1 text-xs text-red-500">{errors.zoneId}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              <MapPin className="inline mr-2 h-4 w-4" />
              Address*
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full street address"
              rows={3}
              className={`w-full rounded-lg border ${errors.address ? "border-red-500" : "border-stroke"} bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
            />
            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
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

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={createCustomerMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500"
            >
              <Save size={20} />
              Add Customer
            </button>
          </div>
        </form>
      </div>

      <AddZoneModal
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
        onSuccess={handleZoneCreated}
        refetchZones={refetchZones}
      />
    </DefaultLayout>
  );
}