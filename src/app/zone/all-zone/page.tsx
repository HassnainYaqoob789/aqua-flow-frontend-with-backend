"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  AlertCircle,
  Send,
  Download,
  MapPin,
} from "lucide-react";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useZone, useStatusZone } from "@/lib/api/servicesHooks";
import { Zone } from "@/lib/types/auth";

const ZoneManagement: React.FC = () => {
  const { data, isLoading, isError } = useZone();
  const { mutate: updateStatus, isPending } = useStatusZone();

  const zones: Zone[] = data?.zones || [];

  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Inactive">("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const handleStatusChange = (zoneId: string, status: Zone["status"]) => {
    updateStatus(
      { id: zoneId, status },
      {
        onSuccess: () => setOpenId(null),
      }
    );
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
    }
  });

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Zone Management"
        description="Manage driver routes and delivery zones"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-3 py-4 dark:border-gray-700 dark:bg-gray-800 sm:px-6 sm:py-8 flex justify-end">
          <Link href="/zone/new">
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700">
              <Plus size={20} /> Add Zone
            </button>
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by zone name..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 sm:text-sm">
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">{stat.label}</p>
              <p className={`mt-2 text-lg font-bold sm:text-2xl ${stat.color || "text-gray-900 dark:text-white"}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(tab.split(" ")[0] as "All" | "Active" | "Inactive")}
              className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                activeTab === tab.split(" ")[0]
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
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-3 py-3 sm:px-6 sm:py-4 bg-gray-200 dark:bg-gray-700 rounded">&nbsp;</td>
                      ))}
                    </tr>
                  ))
                : filteredZones.map((zone) => {
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
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(zone.status)}`}>
                            {zone.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4">
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <Link href={`/zone/${zone.id}`}>
                              <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                <Edit size={16} />
                              </button>
                            </Link>
                            <div className="relative">
                              <button onClick={() => setOpenId(openId === zone.id ? null : zone.id)}
                                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                <MoreVertical size={16} />
                              </button>
                              {openId === zone.id && (
                                <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700">
                                  {zone.status === "active" ? (
                                    <button onClick={() => handleStatusChange(zone.id, "inactive")}
                                      disabled={isPending}
                                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-red-900/30">
                                      ✗ Deactivate
                                    </button>
                                  ) : (
                                    <button onClick={() => handleStatusChange(zone.id, "active")}
                                      disabled={isPending}
                                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-green-900/30">
                                      ✓ Activate
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>

          {!isLoading && zones.length === 0 && (
            <div className="p-8 text-center">
              <MapPin className="mx-auto mb-3 h-12 w-12 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">No zones found</p>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ZoneManagement;
