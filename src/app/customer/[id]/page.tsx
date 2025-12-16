"use client";
import React, { useState, FormEvent, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  User,
  Globe,
  Save,
  MapPinPlus,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {
  useCreateCustomer,
  useUpdateCustomer,
  useZone,
  useCreateZone,
  useCustomers,
} from "@/lib/api/servicesHooks";
import { useCustomerStore } from "@/lib/store/useCustomerStore";
import { Customer, Zone } from "@/lib/types/typeInterfaces";
import { useZoneStore } from "@/lib/store/useZoneStore";

interface ZoneFormData {
  name: string;
  description: string;
}

interface AddZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchZones: () => void;
}

const AddZoneModal: React.FC<AddZoneModalProps> = ({
  isOpen,
  onClose,
  refetchZones,
}) => {
  const [formData, setFormData] = useState<ZoneFormData>({
    name: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const createZoneMutation = useCreateZone();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleSubmit = () => {
    if (!validateForm()) return;

    createZoneMutation.mutate(formData, {
      onSuccess: () => {
        refetchZones();
        setFormData({ name: "", description: "" });
        onClose();
      },
      onError: (err: any) => {
        setError(
          err.response?.data?.message || err.message || "Failed to create zone."
        );
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Add New Zone
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Enter the zone details to create a new delivery zone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 space-y-4">
            {/* Name Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Zone Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., North Zone"
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="e.g., Covers Lahore North"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 px-3 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <div className="space-y-4 sm:space-x-3 sm:space-y-0 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={createZoneMutation.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:ml-3 sm:w-auto"
              >
                {createZoneMutation.isPending ? "Creating..." : "Create Zone"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CustomerFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isViewMode = mode === "view";

  const params = useParams();
  const id = params?.id as string;
  const isCreateMode = id === "new";

  const { data: customerList } = useCustomers();
  const { state: customerState } = useCustomerStore();

  const { data: zonesData, isLoading: isLoadingZones, isError: isErrorZones, refetch: refetchZones } = useZone();
  const zones = useZoneStore((s) => s.state.zone) || [];
  const setZones = (zonesArray: Zone[]) => useZoneStore.getState().setState({ zone: zonesArray });

  useEffect(() => {
    if (zonesData?.zones) setZones(zonesData.zones);
  }, [zonesData]);

  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();

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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Prefill form in edit/view mode
  useEffect(() => {
    if (!isCreateMode) {
      const customer =
        customerState.customers.find((c) => c.id === id) ||
        customerList?.customers.find((c) => c.id === id);

      if (customer) {
        setFormData({
          name: customer.name ?? "",
          email: customer.email ?? "",
          phone: customer.phone ?? "",
          address: customer.address ?? "",
          city: customer.city ?? "",
          postalCode: customer.postalCode ?? "",
          country: customer.country ?? "",
          zoneId: customer.zone?.id ?? "",
        });
      }
    }
  }, [id, isCreateMode, customerState.customers, customerList]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.zoneId) newErrors.zoneId = "Zone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isCreateMode) {
      createCustomerMutation.mutate(formData, {
        onSuccess: () => router.push("/customer/all-customers"),
        onError: (err: any) =>
          alert(err?.response?.data?.message || err?.message || "Unknown error"),
      });
    } else {
      updateCustomerMutation.mutate(
        { id, ...formData },
        {
          onSuccess: () => router.push("/customer/all-customers"),
          onError: (err: any) =>
            alert(err?.response?.data?.message || err?.message || "Unknown error"),
        }
      );
    }
  };

  const [showZoneModal, setShowZoneModal] = useState(false);

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={isCreateMode ? "Add New Customer" : "Edit Customer"}
        description={
          isCreateMode
            ? "Fill in the details to create a new customer profile"
            : "Update the customer details"
        }
      />

      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() =>
            router.push(isViewMode ? "/order/all-orders" : "/customer/all-customers")
          }
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200"
        >
          <ArrowLeft size={20} />
          <span>{isViewMode ? "Back to Orders" : "Back to Customers"}</span>
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-6 py-8 shadow-default sm:px-7.5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name + Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                <User className="mr-2 inline h-4 w-4" />
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                disabled={isViewMode}
                onChange={handleChange}
                placeholder="Enter name"
                className={`w-full rounded-lg border ${
                  errors.name ? "border-red-500" : "border-stroke"
                } py-2 px-4 text-sm outline-none`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                <Mail className="mr-2 inline h-4 w-4" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled={isViewMode}
                onChange={handleChange}
                placeholder="Enter email address"
                className={`w-full rounded-lg border ${
                  errors.email ? "border-red-500" : "border-stroke"
                } py-2 px-4 text-sm outline-none`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>

          {/* Phone + Zone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                <Phone className="mr-2 inline h-4 w-4" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                disabled={isViewMode}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={`w-full rounded-lg border ${
                  errors.phone ? "border-red-500" : "border-stroke"
                } py-2 px-4 text-sm outline-none`}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                <MapPin className="inline mr-2 h-4 w-4" />
                Zone *
              </label>
              <div className="flex gap-2">
                {isLoadingZones ? (
                  <p className="text-sm text-gray-500">Loading zones...</p>
                ) : isErrorZones ? (
                  <p className="text-sm text-red-500">Failed to load zones</p>
                ) : (
                  <>
                    <select
                      name="zoneId"
                      value={formData.zoneId}
                      onChange={handleChange}
                      disabled={isViewMode}
                      className={`flex-1 rounded-lg border ${
                        errors.zoneId ? "border-red-500" : "border-stroke"
                      } py-2 px-4 text-sm outline-none`}
                    >
                      <option value="">Select Zone</option>
                      {zones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name}
                        </option>
                      ))}
                    </select>
                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={() => setShowZoneModal(true)}
                        className="flex h-10 items-center justify-center rounded-lg bg-[#1C2434] px-3 text-white"
                      >
                        <MapPinPlus size={16} />
                      </button>
                    )}
                  </>
                )}
              </div>
              {errors.zoneId && <p className="mt-1 text-xs text-red-500">{errors.zoneId}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              <MapPin className="mr-2 inline h-4 w-4" />
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              disabled={isViewMode}
              onChange={handleChange}
              placeholder="Enter full street address"
              rows={3}
              className={`w-full rounded-lg border ${
                errors.address ? "border-red-500" : "border-stroke"
              } py-2 px-4 text-sm outline-none`}
            />
            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
          </div>

          {/* City, Postal, Country */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {["city", "postalCode", "country"].map((field) => (
              <div key={field}>
                <label className="mb-2 block text-sm font-medium text-black">
                  {field.charAt(0).toUpperCase() + field.slice(1)} *
                </label>
                <input
                  type="text"
                  name={field}
                  value={(formData as any)[field]}
                  disabled={isViewMode}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  className={`w-full rounded-lg border ${
                    (errors as any)[field] ? "border-red-500" : "border-stroke"
                  } py-2 px-4 text-sm outline-none`}
                />
                {(errors as any)[field] && (
                  <p className="mt-1 text-xs text-red-500">{(errors as any)[field]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Submit */}
          {!isViewMode && (
            <div className="pt-4">
              <button
                type="submit"
                disabled={createCustomerMutation.isPending || updateCustomerMutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white"
              >
                <Save size={20} />
                {isCreateMode ? "Add Customer" : "Update Customer"}
              </button>
            </div>
          )}
        </form>
      </div>

      <AddZoneModal
        isOpen={showZoneModal}
        onClose={() => setShowZoneModal(false)}
        refetchZones={refetchZones}
      />
    </DefaultLayout>
  );
}
