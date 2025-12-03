"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  User,
  Phone,
  MapPin,
  Truck,
  Star,
  Wifi,
  Eye,
  Loader2,
  Edit,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { useDriver, useStatusUpdateDriver } from "@/lib/api/servicesHooks";

interface Zone {
  name: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleId: string;
  zoneId: string;
  status: "active" | "inactive";
  rating: number;
  totalDeliveries: number;
  todayDeliveries: number;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  userId: string | null;
  zone: Zone;
  totalRatings: number
}

interface Stats {
  totalDrivers: number;
  activeNow: number;
  deliveriesToday: number;
  activeRoutes: number;
}

interface DriverResponse {
  drivers: Driver[];
  stats: Stats;
}

export default function DriverRouteManagement() {

  const { data, isLoading, isError } = useDriver();
  const { mutate: updateStatus, isPending } = useStatusUpdateDriver();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);

  const driverData = data as DriverResponse | undefined;
  const drivers = driverData?.drivers || [];
  const stats = driverData?.stats || {
    totalDrivers: 0,
    activeNow: 0,
    deliveriesToday: 0,
    activeRoutes: 0,
  };

  // Filter drivers based on search and status
  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesSearch =
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.phone.includes(searchQuery);

      const matchesStatus =
        !statusFilter || driver.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [drivers, searchQuery, statusFilter]);

  const handleStatusChange = (
    driverId: string,
    status: Driver["status"],
  ) => {
    console.log("Status changed to:", status);

    updateStatus(
      { id: driverId, status },
      {
        onSuccess: () => {
          setOpenId(null);
        },
      },
    );
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-50 text-green-700 border border-green-200";
      case "inactive":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DefaultLayout>
    );
  }

  if (isError) {
    return (
      <DefaultLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-red-500">Error loading driver data. Please try again.</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Driver & Zone Management"
        description="Manage delivery routes, and schedules"
      />
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="block sm:hidden">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Driver & Zone Management
          </h2>
        </div>
        <Link href="/driver/add" className="sm:ml-auto">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto">
            <Plus size={20} />
            Add Driver
          </button>
        </Link>
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search drivers by name, ID, vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary sm:text-base"
          />
        </div>
        <div className="flex gap-3 sm:gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 rounded-lg border border-stroke bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input sm:flex-none sm:px-4 sm:text-base"
          >
            <option value="">All Drivers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-stroke px-3 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4 sm:px-4 sm:text-base">
            <Filter size={20} />
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4 lg:grid-cols-4">
        <div className="relative rounded-sm border border-stroke bg-white px-4 py-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-6">
          <p className="mb-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
            Total Drivers
          </p>
          <p className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
            {stats.totalDrivers}
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
            {stats.activeNow}
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
            {stats.deliveriesToday}
          </p>
          <div className="absolute right-3 top-3 text-blue-400">
            <Truck size={16} />
          </div>
        </div>
      </div>
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
                  Deliveries
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Performance
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Mode
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="border-b border-[#eee] px-4 py-8 text-center dark:border-strokedark"
                  >
                    <p className="text-gray-500 dark:text-gray-400">
                      No drivers found
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr key={driver.id}>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-700">
                          {getInitials(driver.name)}
                        </div>
                        <div>
                          <h5 className="font-medium text-black dark:text-white">
                            {driver.name}
                          </h5>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {driver.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {driver.phone}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div>
                        <p className="text-black dark:text-white">
                          {driver.zone.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {driver.vehicleId}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div>
                        <span className="text-sm font-medium text-black dark:text-white">
                          Today: {driver.todayDeliveries}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Total: {driver.totalDeliveries}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span className="text-sm font-medium text-black dark:text-white">
                          {driver.totalRatings?.toFixed(1) ?? "0.0"}
                        </span>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          driver.status
                        )}`}
                      >
                        <div className="h-2 w-2 rounded-full bg-current"></div>
                        {driver.status.charAt(0).toUpperCase() +
                          driver.status.slice(1)}
                      </span>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex items-center gap-2">
                        <Link href={`/driver/${driver.id}`}>
                          <button
                            className="p-1 text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <Edit size={16} className="sm:size-[18px]" />
                          </button>
                        </Link>

                        <div className="relative">
                          <button 
                            onClick={() => setOpenId(openId === driver.id ? null : driver.id)}
                            className="p-1 text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <MoreVertical size={16} className="sm:size-[18px]" />
                          </button>

                          {/* Dropdown Menu - Shows opposite status */}
                          {openId === driver.id && (
                            <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700">
                              {driver.status === "active" ? (
                                <button
                                  onClick={() =>
                                    handleStatusChange(
                                      driver.id,
                                      "inactive",
                                    )
                                  }
                                  disabled={isPending}
                                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg hover:bg-red-50 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-red-900/30"
                                >
                                  ✗ Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleStatusChange(driver.id, "active")
                                  }
                                  disabled={isPending}
                                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg hover:bg-green-50 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-green-900/30"
                                >
                                  ✓ Activate
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4 lg:hidden">
        {filteredDrivers.length === 0 ? (
          <div className="rounded-sm border border-stroke bg-white p-8 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
            <p className="text-gray-500 dark:text-gray-400">
              No drivers found
            </p>
          </div>
        ) : (
          filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-700">
                    {getInitials(driver.name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-black dark:text-white">
                      {driver.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {driver.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/driver/${driver.id}`}>
                    <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                      <Eye size={18} />
                    </button>
                  </Link>

                  <div className="relative">
                    <button 
                      onClick={() => setOpenId(openId === driver.id ? null : driver.id)}
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* Dropdown Menu - Shows opposite status */}
                    {openId === driver.id && (
                      <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700">
                        {driver.status === "active" ? (
                          <button
                            onClick={() =>
                              handleStatusChange(
                                driver.id,
                                "inactive",
                              )
                            }
                            disabled={isPending}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg hover:bg-red-50 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-red-900/30"
                          >
                            ✗ Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleStatusChange(driver.id, "active")
                            }
                            disabled={isPending}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg hover:bg-green-50 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-green-900/30"
                          >
                            ✓ Activate
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-stroke pt-3 dark:border-strokedark">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    <Phone className="inline h-3 w-3" /> Contact:
                  </span>
                  <span className="font-medium text-black dark:text-white">
                    {driver.phone}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    <MapPin className="inline h-3 w-3" /> Zone:
                  </span>
                  <div className="text-right">
                    <div className="font-medium text-black dark:text-white">
                      {driver.zone.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {driver.vehicleId}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    <Truck className="inline h-3 w-3" /> Deliveries:
                  </span>
                  <div className="text-right">
                    <span className="font-medium text-black dark:text-white">
                      Today: {driver.todayDeliveries}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Total: {driver.totalDeliveries}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    <Star className="inline h-3 w-3 fill-current text-yellow-500" />{" "}
                    Performance:
                  </span>
                  <span className="font-semibold text-black dark:text-white">
                    {driver.rating?.toFixed(1) ?? "0.0"}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status:
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                      driver.status
                    )}`}
                  >
                    <div className="h-2 w-2 rounded-full bg-current"></div>
                    {driver.status.charAt(0).toUpperCase() +
                      driver.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DefaultLayout>
  );
}