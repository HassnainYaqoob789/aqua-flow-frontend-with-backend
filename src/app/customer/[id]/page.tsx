"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { ArrowLeft, Mail, Phone, MapPin, User, Globe, Save } from "lucide-react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useCreateCustomer, useUpdateCustomer } from "@/lib/api/servicesHooks";
// import { useCustomerStore } from "@/lib/store/useCustomerStore"; // if you want to prefill from store
// import type { Customer } from "@/lib/types/customer";
import { useRouter } from "next/navigation";

export default function CustomerFormPage() {
  const router = useRouter();

  const params = useParams();
  const id = params?.id as string; // "new" or actual customer id

  const isCreateMode = id === "new";

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
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Optional: If you have customers in Zustand and want to prefill in edit mode
  // const { state } = useCustomerStore();
  // useEffect(() => {
  //   if (!isCreateMode) {
  //     const customer = state.customers.find((c) => c.id === id);
  //     if (customer) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         name: customer.name ?? "",
  //         email: customer.email ?? "",
  //         phone: customer.phone ?? "",
  //         address: customer.address ?? "",
  //         city: customer.city ?? "",
  //         postalCode: customer.postalCode ?? "",
  //         country: customer.country ?? "",
  //         password: "", // we never prefill password
  //       }));
  //     }
  //   }
  // }, [id, isCreateMode, state.customers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "First name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    // Password only required in CREATE mode
    if (isCreateMode) {
      if (!formData.password?.trim()) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    updateCustomerMutation.mutate(
      {
        id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      {
        onSuccess: () => {
          console.log("Customer updated successfully!");
          router.push("/customer/all-customers");
        },

        onError: (err: any) => {
          alert(
            `Failed to update customer: ${err?.response?.data?.message || err?.message || "Unknown error"
            }`
          );
        },
      }
    );
  };


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
          onClick={() => window.history.back()}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200 dark:bg-meta-4 dark:text-white dark:hover:bg-meta-3"
        >
          <ArrowLeft size={20} />
          <span>Back to Customers</span>
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-6 py-8 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name + Password (password only meaningful in create mode) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <User className="mr-2 inline h-4 w-4" />
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter first name"
                className={`w-full rounded-lg border ${errors.name ? "border-red-500" : "border-stroke"
                  } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <User className="mr-2 inline h-4 w-4" />
                Password {isCreateMode && "*"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  isCreateMode ? "Enter your password" : "Leave blank to keep unchanged"
                }
                className={`w-full rounded-lg border ${errors.password ? "border-red-500" : "border-stroke"
                  } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <Mail className="mr-2 inline h-4 w-4" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={`w-full rounded-lg border ${errors.email ? "border-red-500" : "border-stroke"
                  } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <Phone className="mr-2 inline h-4 w-4" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={`w-full rounded-lg border ${errors.phone ? "border-red-500" : "border-stroke"
                  } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              <MapPin className="mr-2 inline h-4 w-4" />
              Street Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full street address"
              className={`w-full rounded-lg border ${errors.address ? "border-red-500" : "border-stroke"
                } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-500">{errors.address}</p>
            )}
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
                className={`w-full rounded-lg border ${errors.city ? "border-red-500" : "border-stroke"
                  } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
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
                className={`w-full rounded-lg border ${errors.postalCode ? "border-red-500" : "border-stroke"
                  } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.postalCode && (
                <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <Globe className="mr-2 inline h-4 w-4" />
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
                className={`w-full rounded-lg border ${errors.country ? "border-red-500" : "border-stroke"
                  } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.country && (
                <p className="mt-1 text-xs text-red-500">{errors.country}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500"
            >
              <Save size={20} />
              {isCreateMode ? "Add Customer" : "Update Customer"}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}
