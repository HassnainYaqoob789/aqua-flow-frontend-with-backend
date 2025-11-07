"use client";

import React, { useState, ChangeEvent } from "react";
import { ArrowLeft, User, Phone, MapPin, Truck, Wifi, Save } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface FormData {
  id: string;
  name: string;
  contact: string;
  zone: string;
  vehicle: string;
  status: "Online" | "Offline";
  mode: "Online Mode" | "Hybrid Mode" | "Offline Mode";
}

interface Errors {
  [key: string]: string;
}

export default function AddDriver() {
  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    contact: "",
    zone: "",
    vehicle: "",
    status: "Online",
    mode: "Online Mode",
  });

  const [errors, setErrors] = useState<Errors>({});

  const zones: string[] = [
    "Zone A - Downtown",
    "Zone B - Uptown",
    "Zone C - Business District",
    "Zone D - Suburbs",
  ];

  const modes: ("Online Mode" | "Hybrid Mode" | "Offline Mode")[] = ["Online Mode", "Hybrid Mode", "Offline Mode"];
  const statuses: ("Online" | "Offline")[] = ["Online", "Offline"];

  // Auto-generate initials from name
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
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.id.trim()) newErrors.id = "Driver ID is required";
    if (!formData.name.trim()) newErrors.name = "Driver name is required";
    if (!formData.contact.trim()) newErrors.contact = "Contact number is required";
    if (!formData.zone.trim()) newErrors.zone = "Zone is required";
    if (!formData.vehicle.trim()) newErrors.vehicle = "Vehicle ID is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.mode) newErrors.mode = "Mode is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Auto-add initials
      const dataWithInitials = { ...formData, initials: getInitials(formData.name) };
      // Simulate API call
      console.log("New Driver Data:", dataWithInitials);
      alert("Driver added successfully! (Check console for data)");
      // Reset form
      setFormData({
        id: "",
        name: "",
        contact: "",
        zone: "",
        vehicle: "",
        status: "Online",
        mode: "Online Mode",
      });
      setErrors({});
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Add New Driver"
        description="Fill in the details to add a new driver to the fleet"
      />

      {/* Header with Back Button */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200 dark:bg-meta-4 dark:text-white dark:hover:bg-meta-3"
        >
          <ArrowLeft size={20} />
          <span>Back to Drivers</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="rounded-sm border border-stroke bg-white px-6 py-8 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ID & Name Section */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <Truck className="inline mr-2 h-4 w-4" />
                Driver ID *
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="e.g., DRV-001"
                className={`w-full rounded-lg border ${
                  errors.id ? "border-red-500" : "border-stroke"
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
                className={`w-full rounded-lg border ${
                  errors.name ? "border-red-500" : "border-stroke"
                } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              {formData.name && (
                <p className="mt-1 text-xs text-gray-500">Initials: {getInitials(formData.name)}</p>
              )}
            </div>
          </div>

          {/* Contact & Zone Section */}
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
                className={`w-full rounded-lg border ${
                  errors.contact ? "border-red-500" : "border-stroke"
                } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.contact && <p className="mt-1 text-xs text-red-500">{errors.contact}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <MapPin className="inline mr-2 h-4 w-4" />
                Zone *
              </label>
              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.zone ? "border-red-500" : "border-stroke"
                } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              >
                <option value="">Select Zone</option>
                {zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
              {errors.zone && <p className="mt-1 text-xs text-red-500">{errors.zone}</p>}
            </div>
          </div>

          {/* Vehicle & Status Section */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <Truck className="inline mr-2 h-4 w-4" />
                Vehicle ID *
              </label>
              <input
                type="text"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                placeholder="e.g., TR-1234"
                className={`w-full rounded-lg border ${
                  errors.vehicle ? "border-red-500" : "border-stroke"
                } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              />
              {errors.vehicle && <p className="mt-1 text-xs text-red-500">{errors.vehicle}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                <Wifi className="inline mr-2 h-4 w-4" />
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.status ? "border-red-500" : "border-stroke"
                } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status}</p>}
            </div>
          </div>

          {/* Mode Section */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              <Wifi className="inline mr-2 h-4 w-4" />
              Mode *
            </label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className={`w-full rounded-lg border ${
                errors.mode ? "border-red-500" : "border-stroke"
              } bg-transparent py-2 px-4 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
            >
              {modes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
            {errors.mode && <p className="mt-1 text-xs text-red-500">{errors.mode}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500"
            >
              <Save size={20} />
              Create Driver
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}