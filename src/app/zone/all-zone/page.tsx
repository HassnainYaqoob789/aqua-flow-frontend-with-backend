"use client";
import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  AlertCircle,
  Send,
  Download,
  MapPin,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { useZone } from "@/lib/api/servicesHooks";
import { setZone } from "@/lib/store/useZoneStore";
import { Zone } from "@/lib/types/auth";

export default function ZoneManagement() {
  const { data: dataaa, isLoading, isError } = useZone();

  // Use React Query data directly
  const zones: Zone[] = dataaa?.zones || [];

  const [activeTab, setActiveTab] = useState("All");

  const handleStatusToggle = (zoneId: string) => {
    const updatedZones = zones.map((zone) => {
      if (zone.id === zoneId) {
        const newStatus: "active" | "inactive" = zone.status === "active" ? "inactive" : "active";
        return { ...zone, status: newStatus };
      }
      return zone;
    });

    // Update Zustand store so data persists
    setZone(updatedZones);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border border-green-200";
      case "inactive":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Stats
  const totalZones = zones.length;
  const activeZones = zones.filter((z) => z.status === "active").length;
  const inactiveZones = zones.filter((z) => z.status === "inactive").length;

  const stats = [
    { label: "Total Zones", value: totalZones.toString() },
    { label: "Active", value: activeZones.toString(), color: "text-green-600" },
    { label: "Inactive", value: inactiveZones.toString(), color: "text-red-500" },
  ];

  const tabs = [
    `All Zones (${totalZones})`,
    `Active (${activeZones})`,
    `Inactive (${inactiveZones})`,
  ];

  const filteredZones = zones.filter((zone) => {
    switch (activeTab) {
      case "All":
        return true;
      case "Active":
        return zone.status === "active";
      case "Inactive":
        return zone.status === "inactive";
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb
          pageName="Zone Management"
          description="Manage driver routes and delivery zones"
        />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading zones...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (isError) {
    return (
      <DefaultLayout>
        <Breadcrumb
          pageName="Zone Management"
          description="Manage driver routes and delivery zones"
        />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
            <p className="text-gray-600 dark:text-gray-400">
              Error loading zones. Please try again later.
            </p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Zone Management"
        description="Manage driver routes and delivery zones"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-3 py-4 dark:border-gray-700 dark:bg-gray-800 sm:px-6 sm:py-8">
          <div className="flex justify-end">
            <Link href="/zone/add-zone" className="sm:ml-auto">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto">
                <Plus size={20} />
                Add Zone
              </button>
            </Link>
          </div>
        </div>

        <div className="p-3 sm:p-6">
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col gap-3 sm:gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by zone name..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 sm:text-sm"
              />
            </div>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 sm:text-sm">
              <Filter size={16} className="sm:size-[18px]" />
              <span>Filter</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6"
              >
                <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">{stat.label}</p>
                <p
                  className={`mt-2 text-lg font-bold sm:text-2xl ${stat.color || "text-gray-900 dark:text-white"}`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(tab.split(" ")[0])}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${activeTab === tab.split(" ")[0]
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Zones Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700">
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">Zone</th>
                  <th className="hidden px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm md:table-cell">Description</th>
                  <th className="hidden px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm lg:table-cell">Created Date</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">Status</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredZones.map((zone) => {
                  const createdDate = new Date(zone.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <tr key={zone.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 py-3 sm:px-6 sm:py-4">
                        <p className="text-xs font-medium text-gray-900 dark:text-white sm:text-sm">{zone.name}</p>
                        <div className="mt-1 space-y-0.5 md:hidden">
                          <p className="text-xs text-gray-600 dark:text-gray-300"><MapPin className="inline h-3 w-3" /> {zone.description}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">Created: {createdDate}</p>
                        </div>
                      </td>
                      <td className="hidden px-3 py-3 sm:px-6 sm:py-4 md:table-cell">
                        <p className="flex items-center gap-1 text-xs text-gray-900 dark:text-white sm:text-sm">
                          <MapPin size={14} /> {zone.description}
                        </p>
                      </td>
                      <td className="hidden px-3 py-3 sm:px-6 sm:py-4 lg:table-cell">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{createdDate}</p>
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(zone.status)}`}>{zone.status}</span>
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <button onClick={() => handleStatusToggle(zone.id)} className="p-1 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            <Eye size={16} className="sm:size-[18px]" />
                          </button>
                          <button className="p-1 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            <MoreVertical size={16} className="sm:size-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Empty State */}
            {zones.length === 0 && !isLoading && (
              <div className="p-8 text-center">
                <MapPin className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">No zones found</p>
              </div>
            )}
          </div>

          {/* Alert Banner */}
          {activeTab === "Inactive" && filteredZones.length > 0 && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20 sm:p-6">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-red-900 dark:text-red-100">Inactive Zones Detected</h3>
                  <p className="mb-4 text-sm text-red-800 dark:text-red-200">
                    {filteredZones.length} zone{filteredZones.length !== 1 ? "s" : ""} currently inactive. Review and reactivate to optimize driver routes.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700">
                      <Send size={16} /> Notify Drivers
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700">
                      <Download size={16} /> Export List
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700">
                      <MapPin size={16} /> Reassign Routes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
