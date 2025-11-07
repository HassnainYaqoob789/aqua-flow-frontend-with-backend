import { MapPin, Truck, Phone, Clock, Check, Users, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface Driver {
  id: string;
  name: string;
  status: "delivering" | "available" | "offline";
  eta: string;
  completed: number;
  pending: number;
  color: string;
}

interface PendingOrder {
  id: string;
  customer: string;
  address: string;
  time: string;
  items: string;
}

export default function DeliveryOperations() {
  const stats: Stat[] = [
    {
      label: "Active Drivers",
      value: "3/4",
      icon: Users,
      color: "text-blue-600",
    },
    { label: "In Transit", value: "8", icon: Truck, color: "text-green-600" },
    {
      label: "Completed Today",
      value: "41",
      icon: Check,
      color: "text-emerald-600",
    },
    {
      label: "Pending Assignment",
      value: "12",
      icon: Package,
      color: "text-orange-600",
    },
  ];

  const drivers: Driver[] = [
    {
      id: "TR-1234",
      name: "Michael Johnson",
      status: "delivering",
      eta: "ETA 15 min",
      completed: 8,
      pending: 3,
      color: "bg-blue-500",
    },
    {
      id: "TR-1235",
      name: "Sarah Williams",
      status: "available",
      eta: "",
      completed: 12,
      pending: 0,
      color: "bg-green-500",
    },
    {
      id: "TR-1236",
      name: "David Brown",
      status: "delivering",
      eta: "ETA 25 min",
      completed: 6,
      pending: 1,
      color: "bg-blue-500",
    },
    {
      id: "TR-1237",
      name: "Emma Davis",
      status: "offline",
      eta: "",
      completed: 15,
      pending: 0,
      color: "bg-gray-500",
    },
  ];

  const pendingOrders: PendingOrder[] = [
    {
      id: "#1238",
      customer: "John Smith",
      address: "123 Oak St",
      time: "2:30 PM",
      items: "2x 20L",
    },
    {
      id: "#1239",
      customer: "Acme Corp",
      address: "456 Business Ave",
      time: "3:30 PM",
      items: "10x 20L",
    },
    {
      id: "#1240",
      customer: "Green Valley School",
      address: "789 School Ln",
      time: "5:30 PM",
      items: "5x 20L",
    },
  ];

  const getStatusColor = (status: "delivering" | "available" | "offline"): string => {
    switch (status) {
      case "delivering":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "offline":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Delivery Operations"
        description="Real-time tracking & fleet management"
      />

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Active Drivers List */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-1">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Active Drivers
              </h3>
            </div>
            <div className="space-y-3 p-6">
              {drivers.map((driver) => (
                <div
                  key={driver.id}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`h-10 w-10 rounded-full ${driver.color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}
                      >
                        {driver.id.slice(-2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {driver.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {driver.id}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`ml-2 inline-flex whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        driver.status
                      )}`}
                    >
                      {driver.status}
                    </span>
                  </div>
                  {driver.eta && (
                    <p className="mb-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                      ⏱️ {driver.eta}
                    </p>
                  )}
                  <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{driver.completed}</span> completed •{" "}
                    <span className="font-medium">{driver.pending}</span> pending
                  </p>
                  <button className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700">
                    <Phone size={14} />
                    Call Driver
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Overview & Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Avg Delivery Time
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  23 min
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  On-time Rate
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  94%
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Total Distance
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  127 km
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Deliveries
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          Order #{1230 + item}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Completed at 2:{item}5 PM
                        </p>
                      </div>
                    </div>
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pending Assignment
            </h3>
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
              Auto-assign
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
            {pendingOrders.map((order) => (
              <div key={order.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {order.id}
                  </h4>
                  <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                </div>
                <p className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  {order.customer}
                </p>
                <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
                  📍 {order.address}
                </p>
                <div className="mb-3 flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {order.time}
                  </span>
                </div>
                <div className="mb-4 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {order.items}
                </div>
                <button className="w-full rounded-lg bg-blue-600 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700">
                  Assign Driver
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}