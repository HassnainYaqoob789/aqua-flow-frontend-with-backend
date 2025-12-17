"use client";

import { MapPin, Truck, Check, Users, Package, Phone, DollarSign, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import {
  useBulkAssignDriver,
  useCustomerByZone,
  useZone,
  useDriver,
} from "@/lib/api/servicesHooks";

import { useEffect, useState } from "react";
import { useDriverStore } from "@/lib/store/useDriver";
import { useZoneStore } from "@/lib/store/useZoneStore";

export interface CustomersByZoneResponse {
  success: boolean;
  zone: string;
  totalEligible: number;
  asOf: string;
  customers: EligibleCustomer[];
}

export interface EligibleCustomer {
  id: string;
  name: string;
  phone: string;
  address: string;
  empties: number;
  deliverableBottles: number;
  pendingOrdersCount: number;
  totalPendingAmount: number;
  pendingOrders: PendingOrder[];
  lastDelivery: string;
  nextEligible: string;
  eligibleToday: boolean;
}

export interface PendingOrder {
  id: string;
  number: string;
  amount: number;
}

/* -------------------------------------------------------
   Main Component
------------------------------------------------------- */
export default function DeliveryOperations() {
  const { data: zoneData, isLoading: zoneLoading, isError: zoneError } = useZone();
  const zones = useZoneStore((s) => s.state.zone) || [];

  useDriver();
  const drivers = useDriverStore((s) => s.state.drivers);

  const { state: zoneState } = useZoneStore();
  const selectedZoneId = zoneState.selectedZoneId;

  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const {
    data: customersResponse,
    isLoading: customersLoading,
    isError: customersError,
    refetch: refetchCustomers,
  } = useCustomerByZone(selectedZoneId);

  const [customers, setCustomers] = useState<EligibleCustomer[]>([]);

  useEffect(() => {
    if (customersResponse?.success && customersResponse.customers) {
      setCustomers(customersResponse.customers);
    }
  }, [customersResponse]);

  useEffect(() => {
    if (zoneData?.zones) {
      useZoneStore.getState().setState({ zone: zoneData.zones });
    }
  }, [zoneData]);

  const setSelectedZone = (zoneId: string) => {
    useZoneStore.getState().setState({ selectedZoneId: zoneId });
  };

  /* Bulk Mutation */
  const { mutate: bulkAssignMutation, isPending: isBulkAssigning } = useBulkAssignDriver();

  const handleBulkAssign = () => {

    const pendingCustomers = customers.filter(c => c.pendingOrdersCount > 0);
    console.log('pendingCustomers:', pendingCustomers);

    if (pendingCustomers.length === 0 || !selectedDriver || !selectedDate || !selectedZoneId) {
      console.log('Early return due to missing data:', {
        pendingCustomersLength: pendingCustomers.length,
        selectedDriver,
        selectedDate,
        selectedZoneId,
      });
      return;
    }

    const customerIds = pendingCustomers.map(c => c.id);
    const payload = {
      zoneId: selectedZoneId,
      driverId: selectedDriver,
      scheduledDate: selectedDate,
      customerIds,
    };

    bulkAssignMutation(payload, {
      onSuccess: () => {
        // Refresh the customers list to reflect the new assignment state
        refetchCustomers();
        setSelectedDriver("");
        setSelectedDate("");
        // useZoneStore.getState().setState({ selectedZoneId: "" });
      },
      onError: (error) => {
        console.error('Mutation error:', error);
        alert("Failed to assign orders.");
      },
    });
  };

  const stats = [
    {
      label: "Total Eligible Customers",
      value: customersResponse?.totalEligible?.toString() || "0",
      icon: Users,
      color: "text-blue-600 bg-blue-50"
    },
    {
      label: "Pending Deliveries",
      value: customers.reduce((acc, c) => acc + c.pendingOrdersCount, 0).toString(),
      icon: Truck,
      color: "text-green-600 bg-green-50"
    },
    {
      label: "Total Pending Amount",
      value: `Rs ${customers.reduce((acc, c) => acc + c.totalPendingAmount, 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50"
    },
    // {
    //   label: "Active Drivers",
    //   value: "3/4",
    //   icon: Package,
    //   color: "text-orange-600 bg-orange-50"
    // },
  ];

  const hasPendingOrders = customers.some(c => c.pendingOrdersCount > 0);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Delivery Operations" description="" />

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        {/* <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div> */}
        {/* Filters */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="border-b bg-gray-50 px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">

              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <MapPin className="inline h-4 w-4 mr-2" /> Zone
                </label>

                {zoneLoading ? (
                  <p className="text-sm text-gray-500">Loading zones...</p>
                ) : zoneError ? (
                  <p className="text-sm text-red-500">Failed to load zones</p>
                ) : (
                  <select
                    value={selectedZoneId || ""}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select Zone</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex-1"
                >
                  <option value="">Select Driver</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {customersLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-500">Loading customers...</p>
              </div>
            ) : customersError ? (
              <p className="text-sm text-red-500 text-center py-8">Failed to load customers</p>
            ) : customers.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No eligible customers for this zone.</p>
            ) : (
              customers.map((customer) => (
                <div key={customer.id} className="rounded-xl border border-gray-200 p-6 bg-white hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${customer.eligibleToday
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {customer.nextEligible}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{customer.phone}</span>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 font-medium break-words">{customer.address}</span>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Last: {customer.lastDelivery}</span>
                    </div>

                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Empties: {customer.empties}</span>
                    </div>

                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Deliverable Bottles: {customer.deliverableBottles}</span>
                    </div>
                  </div>

                  {customer.pendingOrdersCount > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-3 text-gray-700">
                        Pending Orders (Total: Rs {customer.totalPendingAmount.toLocaleString()})
                      </p>
                      <div className="space-y-2">
                        {customer.pendingOrders.map((order) => (
                          <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm border">
                            <span className="font-medium text-gray-900">{order.number}</span>
                            <span className="text-gray-600">Rs {order.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {hasPendingOrders && (
            <div className="mt-6 p-6 border-t">
              <button
                onClick={handleBulkAssign}
                disabled={!selectedDriver || !selectedDate || !selectedZoneId || isBulkAssigning}
                className="w-full disabled:opacity-50 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                {isBulkAssigning ? "Assigning..." : "Assign Driver to All Pending Orders"}
              </button>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}