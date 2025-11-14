"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  User,
  Phone,
  MapPin,
  Truck,
  Check,
  Star,
  Clock,
  Wifi,
  Eye,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";

interface TodayDeliveries {
  completed: number;
  pending: number;
}

interface Driver {
  id: string;
  name: string;
  initials: string;
  contact: string;
  zone: string;
  vehicle: string;
  todayDeliveries: TodayDeliveries;
  performance: number;
  lastSync: string;
  status: "Active" | "Deactive";
  // mode: "Online Mode" | "Hybrid Mode" | "Offline Mode";
}

export default function DriverRouteManagement() {
  const [drivers] = useState<Driver[]>([
    {
      id: "DRV-001",
      name: "Michael Johnson",
      initials: "MJ",
      contact: "+1 555-0201",
      zone: "Zone A - Downtown",
      vehicle: "TR-1234",
      todayDeliveries: { completed: 8, pending: 4 },
      performance: 4.8,
      lastSync: "2 mins ago",
      status: "Active",
      // mode: "Online Mode",
    },
    {
      id: "DRV-002",
      name: "Sarah Williams",
      initials: "SW",
      contact: "+1 555-0202",
      zone: "Zone B - Uptown",
      vehicle: "TR-1235",
      todayDeliveries: { completed: 12, pending: 2 },
      performance: 4.9,
      lastSync: "1 min ago",
      status: "Deactive",
      // mode: "Online Mode",
    },
    {
      id: "DRV-003",
      name: "David Brown",
      initials: "DB",
      contact: "+1 555-0203",
      zone: "Zone C - Business District",
      vehicle: "TR-1236",
      todayDeliveries: { completed: 6, pending: 8 },
      performance: 4.7,
      lastSync: "15 mins ago",
      status: "Active",
      // mode: "Hybrid Mode",
    },
    {
      id: "DRV-004",
      name: "Emma Davis",
      initials: "ED",
      contact: "+1 555-0204",
      zone: "Zone A - Downtown",
      vehicle: "TR-1237",
      todayDeliveries: { completed: 0, pending: 0 },
      performance: 4.6,
      lastSync: "2 hours ago",
      status: "Deactive",
      // mode: "Offline Mode",
    },
  ]);

  const getStatusColor = (status: "Active" | "Deactive"): string => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Deactive":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getModeColor = (mode: "Online Mode" | "Hybrid Mode" | "Offline Mode"): string => {
      // if (mode.includes("Online")) return "bg-green-100 text-green-800";
      // if (mode.includes("Hybrid")) return "bg-yellow-100 text-yellow-800";
      // if (mode.includes("Offline")) return "bg-red-100 text-red-800";
      // return "bg-gray-100 text-gray-800";
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Driver & Route Management"
        description="Manage delivery fleet, routes, and schedules"
      />

      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="block sm:hidden">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Driver & Route Management
          </h2>
        </div>
        <Link href="/driver/add-driver" className="sm:ml-auto">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto">
            <Plus size={20} />
            Add Driver
          </button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search drivers by name, ID, vehicle..."
            className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary sm:text-base"
          />
        </div>
        <div className="flex gap-3 sm:gap-4">
          <select className="flex-1 rounded-lg border border-stroke bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input sm:flex-none sm:px-4 sm:text-base">
            <option value="">All Drivers</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <button className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-stroke px-3 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4 sm:px-4 sm:text-base">
            <Filter size={20} />
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4 lg:grid-cols-4">
        <div className="relative rounded-sm border border-stroke bg-white px-4 py-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-6">
          <p className="mb-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
            Total Drivers
          </p>
          <p className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
            {drivers.length}
          </p>
          <div className="absolute right-3 top-3 text-gray-400">
            <User size={16} />
          </div>
        </div>
        <div className="relative rounded-sm border border-stroke bg-white px-4 py-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-6">
          <p className="mb-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
            Active Now
          </p>
          <p className="text-2xl font-bold text-green-600 sm:text-3xl">
            {drivers.filter((d) => d.status === "Active").length}
          </p>
          <div className="absolute right-3 top-3 text-green-400">
            <Wifi size={16} />
          </div>
        </div>
        <div className="relative rounded-sm border border-stroke bg-white px-4 py-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-6">
          <p className="mb-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
            Deliveries Today
          </p>
          <p className="text-2xl font-bold text-blue-600 sm:text-3xl">
            {drivers.reduce((acc, d) => acc + d.todayDeliveries.completed + d.todayDeliveries.pending, 0)}
          </p>
          <div className="absolute right-3 top-3 text-blue-400">
            <Truck size={16} />
          </div>
        </div>
        <div className="relative rounded-sm border border-stroke bg-white px-4 py-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-6">
          <p className="mb-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
            Active Routes
          </p>
          <p className="text-2xl font-bold text-purple-600 sm:text-3xl">
            {drivers.filter((d) => d.todayDeliveries.pending > 0).length}
          </p>
          <div className="absolute right-3 top-3 text-purple-400">
            <MapPin size={16} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      {/* <div className="mb-4 flex border-b border-stroke dark:border-strokedark">
        <button className="relative flex-1 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-primary dark:text-gray-400 lg:px-6">
          Drivers ({drivers.length})
          <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 scale-x-0 bg-primary transition-transform lg:hidden"></span>
        </button>
        <button className="relative flex-1 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-primary dark:text-gray-400 lg:px-6">
          Routes & Planning
        </button>
        <button className="relative flex-1 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-primary dark:text-gray-400 lg:px-6">
          Schedule Calendar
        </button>
        <button className="relative flex-1 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-primary dark:text-gray-400 lg:px-6">
          Zone Management
        </button>
      </div> */}

      {/* Drivers Table - Desktop */}
      <div className="hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark lg:block">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Driver
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Contact
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Zone & Vehicle
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Today's Deliveries
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Performance
                </th>
                {/* <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Last Sync
                </th> */}
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-700`}
                      >
                        {driver.initials}
                      </div>
                      <div>
                        <h5 className="font-medium text-black dark:text-white">
                          {driver.name}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {driver.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {driver.contact}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div>
                      <p className="text-black dark:text-white">
                        {driver.zone}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {driver.vehicle}
                      </p>
                    </div>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-black dark:text-white">
                        {driver.todayDeliveries.completed} Completed
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {" "}
                        | {driver.todayDeliveries.pending} Pending
                      </span>
                    </div>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      <span className="text-sm font-medium text-black dark:text-white">
                        {driver.performance}
                      </span>
                    </div>
                  </td>
                  {/* <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {driver.lastSync}
                      </span>
                    </div>
                  </td> */}
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          driver.status
                        )}`}
                      >
                        <div className="h-2 w-2 rounded-full bg-current"></div>
                        {driver.status}
                      </span>
                      {/* <span
                        className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getModeColor(
                          driver.mode
                        )}`}
                      >
                        {driver.mode}
                      </span> */}
                    </div>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drivers Cards - Mobile & Tablet */}
      <div className="space-y-3 sm:space-y-4 lg:hidden">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-700`}
                >
                  {driver.initials}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-black dark:text-white">
                    {driver.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {driver.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                  <Eye size={18} />
                </button>
                <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-stroke pt-3 dark:border-strokedark">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  <Phone className="inline h-3 w-3" /> Contact:
                </span>
                <span className="font-medium text-black dark:text-white">
                  {driver.contact}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  <MapPin className="inline h-3 w-3" /> Zone:
                </span>
                <div className="text-right">
                  <div className="font-medium text-black dark:text-white">
                    {driver.zone}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {driver.vehicle}
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  <Truck className="inline h-3 w-3" /> Today's Deliveries:
                </span>
                <div className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-600" />
                  <span className="font-medium text-black dark:text-white">
                    {driver.todayDeliveries.completed} Completed
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {" "}
                    | {driver.todayDeliveries.pending} Pending
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  <Star className="inline h-3 w-3 fill-current text-yellow-500" />{" "}
                  Performance:
                </span>
                <span className="font-semibold text-black dark:text-white">
                  {driver.performance}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  <Clock className="inline h-3 w-3" /> Last Sync:
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {driver.lastSync}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                      driver.status
                    )}`}
                  >
                    <div className="h-2 w-2 rounded-full bg-current"></div>
                    {driver.status}
                  </span>
                  {/* <span
                    className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getModeColor(
                      driver.mode
                    )}`}
                  >
                    {driver.mode}
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
}