"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  FileText,
  Users,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Funnel,
  DollarSign,
  Package,
  Truck,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  ShoppingCart,
  User,
  XCircle,
} from "lucide-react";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import dynamic from "next/dynamic";
import { useReportStore } from "@/lib/api/servicesHooks";

// Dynamic imports for charts
const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), { ssr: false });
const ChartOne = dynamic(() => import("@/components/Charts/ChartOne"), { ssr: false });
const ChartTwo = dynamic(() => import("@/components/Charts/ChartTwo"), { ssr: false });
const ProductRevenueChart = dynamic(() => import("@/components/Tables/ProductRevenueChart"), { ssr: false });

// TypeScript Interfaces based on API response structure

interface PaymentItem {
  productName: string;
  quantity: number;
  totalAmount: number;
}

interface Zone {
  name: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  zone?: Zone;
}

interface CollectedByDriver {
  id: string;
  name: string;
  vehicleNumber: string;
}

interface Order {
  orderNumberDisplay: string;
}

interface Payment {
  id: string;
  paymentNumber: string;
  customerId: string;
  tenantId: string;
  orderId: string;
  subscriptionId: string | null;
  amount: number;
  paidAmount: number;
  pendingAmount: number;
  collectionType: string;
  dueDate: string;
  paymentDate: string;
  status: string;
  paymentMethod: string | null;
  month: string | null;
  year: string | null;
  cycleStartDate: string | null;
  cycleEndDate: string | null;
  collectedByDriverId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  collectedByDriver?: CollectedByDriver;
  order?: Order;
  subscription: null;
  paymentItems: PaymentItem[];
}

interface ByTypeSum {
  amount: number;
  paidAmount: number;
  pendingAmount: number;
}

interface ByType {
  _sum: ByTypeSum;
  _count: number;
  collectionType: string;
  status: string;
}

interface ByDriver {
  driverId: string;
  driverName: string;
  vehicleNumber: string;
  totalCollected: number;
  collectionCount: number;
}

interface Summary {
  total: number;
  totalAmount: number;
  totalCollected: number;
  totalPending: number;
  byType: ByType[];
  byDriver: ByDriver[];
}

interface ApiResponse {
  success: boolean;
  payments: Payment[];
  summary: Summary;
  filters: Record<string, any>;
}

// Updated store interface
export interface ReportsState {
  reports: ApiResponse | null;
}

// Processed data interfaces
interface ProductSalesDataItem {
  name: string;
  value: number;
}

interface ProductRevenueDataItem {
  product: string;
  revenue: number;
}

interface DriverDataItem {
  name: string;
  collections: number;
  amount: number;
  vehicle: string;
  id: string;
}

interface StatusDataItem {
  status: string;
  type: string;
  amount: number;
  collected: number;
  pending: number;
  count: number;
}

interface TopCustomerDataItem {
  id: string;
  name: string;
  phone: string;
  zone: string;
  totalSpent: number;
  orderCount: number;
}

interface ZoneDataItem {
  zone: string;
  count: number;
  revenue: number;
}

interface PaymentMethodDataItem {
  method: string;
  count: number;
  amount: number;
}

interface ProcessedData {
  productSalesData: ProductSalesDataItem[];
  productRevenueData: ProductRevenueDataItem[];
  driverData: DriverDataItem[];
  statusData: StatusDataItem[];
  topCustomers: TopCustomerDataItem[];
  zoneData: ZoneDataItem[];
  paymentMethods: PaymentMethodDataItem[];
  recentTransactions: Payment[];
  collectionRate: string;
  summary: Summary;
}

export default function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [filter, setFilter] = useState("All");
  const { data, isLoading, isError } = useReportStore() as { data: ApiResponse | undefined; isLoading: boolean; isError: boolean };

  // Process API data comprehensively
  const processedData: ProcessedData | null = useMemo(() => {
    if (!data?.payments || !data?.summary) {
      return null;
    }

    // Product Sales Distribution and Revenue
    const productMap = new Map<string, { quantity: number; revenue: number }>();
    data.payments.forEach((payment: Payment) => {
      payment.paymentItems?.forEach((item: PaymentItem) => {
        const existing = productMap.get(item.productName) || { quantity: 0, revenue: 0 };
        productMap.set(item.productName, {
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + item.totalAmount,
        });
      });
    });

    const productSalesData: ProductSalesDataItem[] = Array.from(productMap.entries()).map(([name, data]) => ({
      name,
      value: data.quantity,
    }));

    const productRevenueData: ProductRevenueDataItem[] = Array.from(productMap.entries()).map(([name, data]) => ({
      product: name,
      revenue: data.revenue,
    }));

    // Driver performance
    const driverData: DriverDataItem[] = data.summary.byDriver?.map((driver: ByDriver) => ({
      name: driver.driverName,
      collections: driver.collectionCount,
      amount: driver.totalCollected,
      vehicle: driver.vehicleNumber,
      id: driver.driverId,
    })) || [];

    // Payment status
    const statusData: StatusDataItem[] = data.summary.byType?.map((type: ByType) => ({
      status: type.status,
      type: type.collectionType,
      amount: type._sum.amount || 0,
      collected: type._sum.paidAmount || 0,
      pending: type._sum.pendingAmount || 0,
      count: type._count,
    })) || [];

    // Customer analysis
    const customerMap = new Map<string, { name: string; phone: string; zone: string; totalSpent: number; orderCount: number }>();
    const zoneMap = new Map<string, { count: number; revenue: number }>();

    data.payments.forEach((payment: Payment) => {
      // Customers
      if (payment.customer) {
        const existing = customerMap.get(payment.customerId) || {
          name: payment.customer.name,
          phone: payment.customer.phone,
          zone: payment.customer.zone?.name || "N/A",
          totalSpent: 0,
          orderCount: 0,
        };
        customerMap.set(payment.customerId, {
          ...existing,
          totalSpent: existing.totalSpent + payment.amount,
          orderCount: existing.orderCount + 1,
        });

        // Zones
        const zoneName = payment.customer.zone?.name || "Unknown";
        const zoneExisting = zoneMap.get(zoneName) || { count: 0, revenue: 0 };
        zoneMap.set(zoneName, {
          count: zoneExisting.count + 1,
          revenue: zoneExisting.revenue + payment.amount,
        });
      }
    });

    const topCustomers: TopCustomerDataItem[] = Array.from(customerMap.entries())
      .map(([id, customer]) => ({ id, ...customer }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    const zoneData: ZoneDataItem[] = Array.from(zoneMap.entries()).map(([name, data]) => ({
      zone: name,
      count: data.count,
      revenue: data.revenue,
    }));

    // Payment method breakdown
    const paymentMethodMap = new Map<string, { count: number; amount: number }>();
    data.payments.forEach((payment: Payment) => {
      const method = payment.paymentMethod || "Unknown";
      const existing = paymentMethodMap.get(method) || { count: 0, amount: 0 };
      paymentMethodMap.set(method, {
        count: existing.count + 1,
        amount: existing.amount + payment.amount,
      });
    });

    const paymentMethods: PaymentMethodDataItem[] = Array.from(paymentMethodMap.entries()).map(([method, data]) => ({
      method,
      count: data.count,
      amount: data.amount,
    }));

    // Recent transactions
    const recentTransactions: Payment[] = data.payments
      .sort((a: Payment, b: Payment) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
      .slice(0, 10);

    // Collection efficiency
    const collectionRate = data.summary.totalAmount > 0
      ? ((data.summary.totalCollected / data.summary.totalAmount) * 100).toFixed(1)
      : "0";

    return {
      productSalesData,
      productRevenueData,
      driverData,
      statusData,
      topCustomers,
      zoneData,
      paymentMethods,
      recentTransactions,
      collectionRate,
      summary: data.summary,
    };
  }, [data]);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

  // No Data Component
  const NoDataCard = ({ icon: Icon, title, message }: { icon: React.ElementType; title: string; message: string }) => (
    <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-600 dark:bg-gray-800/50">
      <div className="mb-4 rounded-full bg-gray-200 p-4 dark:bg-gray-700">
        <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h4 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );

  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb
          pageName="Reports & Analytics"
          description="Generate insights and export data"
        />
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            <p className="text-gray-500">Loading reports data...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (isError || !processedData) {
    return (
      <DefaultLayout>
        <Breadcrumb
          pageName="Reports & Analytics"
          description="Generate insights and export data"
        />
        <div className="flex h-96 items-center justify-center">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
            <p className="text-lg font-semibold text-red-600">Error loading reports data</p>
            <p className="mt-2 text-sm text-red-500">Please try again later</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }
  console.log("chrckDttaaaa", processedData.productRevenueData)
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Reports & Analytics"
        description="Comprehensive business insights and data analysis"
      />

      {/* Header Controls */}


      {/* Key Metrics - Top Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-3xl font-bold text-black dark:text-white">
                {processedData.summary.total}
              </h4>
              <p className="mt-1 text-sm font-medium text-gray-500">Total Transactions</p>
            </div>
            <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900/30">
              <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-3xl font-bold text-black dark:text-white">
                Rs. {processedData.summary.totalAmount.toLocaleString()}
              </h4>
              <p className="mt-1 text-sm font-medium text-gray-500">₨ Total Revenue</p>
            </div>
            <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
              {/* <className="h-7 w-7 text-green-600 dark:text-green-400" /> */}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-3xl font-bold text-green-600 dark:text-green-400">
                Rs. {processedData.summary.totalCollected.toLocaleString()}
              </h4>
              <p className="mt-1 text-sm font-medium text-gray-500">Amount Collected</p>
            </div>
            <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
              <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                Rs. {processedData.summary.totalPending.toLocaleString()}
              </h4>
              <p className="mt-1 text-sm font-medium text-gray-500">Pending Amount</p>
            </div>
            <div className="rounded-full bg-orange-100 p-4 dark:bg-orange-900/30">
              <Clock className="h-7 w-7 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Collection Efficiency */}
      {/* <div className="mb-6 rounded-lg border border-stroke bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-default dark:border-strokedark dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-600 p-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black dark:text-white">
                Collection Efficiency Rate
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Percentage of total revenue successfully collected
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {processedData.collectionRate}%
            </div>
          </div>
        </div>
      </div> */}

      {/* Driver Performance & Payment Methods */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Driver Performance */}
        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                <Truck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Driver Collection Performance
              </h3>
            </div>
          </div>
          <div className="p-6">
            {processedData.driverData.length > 0 ? (
              <div className="space-y-4">
                {processedData.driverData.map((driver: DriverDataItem, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-meta-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <Truck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-black dark:text-white">
                          {driver.name}
                        </p>
                        <p className="text-sm text-gray-500">{driver.vehicle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        Rs. {driver.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {driver.collections} collection{driver.collections !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoDataCard icon={Truck} title="No Driver Data" message="No collection performance data available for the selected period." />
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Payment Methods Breakdown
              </h3>
            </div>
          </div>
          <div className="p-6">
            {processedData.paymentMethods.length > 0 ? (
              <div className="space-y-4">
                {processedData.paymentMethods.map((method: PaymentMethodDataItem, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border border-stroke p-4 dark:border-strokedark"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-semibold capitalize text-black dark:text-white">
                        {method.method.replace(/_/g, ' ')}
                      </span>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {method.count} transactions
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Total Amount:</span>
                      <span className="text-lg font-bold text-black dark:text-white">
                        Rs. {method.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoDataCard icon={CreditCard} title="No Payment Methods" message="No payment methods data available for the selected period." />
            )}
          </div>
        </div>
      </div>

      {/* Product Analytics */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Product Sales Distribution */}
        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                <PieChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Product Sales Distribution
              </h3>
            </div>
          </div>
          <div className="p-6">
            {processedData.productSalesData.length > 0 ? (
              <ChartThree data={processedData.productSalesData} colors={COLORS} />
            ) : (
              <NoDataCard icon={PieChart} title="No Product Sales Data" message="No product sales distribution data available." />
            )}
          </div>
        </div>

        {/* Product Revenue Analysis */}
        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
                <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Product Revenue Analysis
              </h3>
            </div>
          </div>
          <div className="p-6">
            {processedData.productRevenueData.length > 0 ? (
              <ProductRevenueChart data={processedData.productRevenueData} />
            ) : (
              <NoDataCard icon={BarChart3} title="No Product Revenue Data" message="No product revenue data available for analysis." />
            )}
          </div>
        </div>
      </div>

      {/* Top Customers & Zone Analysis */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Customers */}
        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Top Customers
              </h3>
            </div>
          </div>
          <div className="p-6">
            {processedData.topCustomers.length > 0 ? (
              <div className="space-y-4">
                {processedData.topCustomers.map((customer: TopCustomerDataItem, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-meta-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <User className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-black dark:text-white">
                          {customer.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {customer.phone} • {customer.zone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        Rs. {customer.totalSpent.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {customer.orderCount} order{customer.orderCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoDataCard icon={Users} title="No Customer Data" message="No top customers data available for the selected period." />
            )}
          </div>
        </div>

        {/* Zone Analysis */}
        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Revenue by Zone
              </h3>
            </div>
          </div>
          <div className="p-6">
            {processedData.zoneData.length > 0 ? (
              <div className="space-y-3">
                {processedData.zoneData.map((zone: ZoneDataItem, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border border-stroke p-4 dark:border-strokedark"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <span className="font-semibold text-black dark:text-white">
                          {zone.zone}
                        </span>
                      </div>
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                        {zone.count} orders
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Total Revenue:</span>
                      <span className="text-lg font-bold text-black dark:text-white">
                        Rs. {zone.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoDataCard icon={MapPin} title="No Zone Data" message="No revenue data by zone available." />
            )}
          </div>
        </div>
      </div>

      {/* Payment Status Breakdown */}
      <div className="mb-6 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Funnel className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Payment Status Overview
            </h3>
          </div>
        </div>
        <div className="p-6">
          {processedData.statusData.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {processedData.statusData.map((status: StatusDataItem, index: number) => (
                <div
                  key={index}
                  className="rounded-lg border-2 border-stroke bg-gradient-to-br from-gray-50 to-white p-5 dark:border-strokedark dark:from-meta-4 dark:to-boxdark"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">
                      {status.type}
                    </span>
                    <span
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${status.status === "PAID"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        }`}
                    >
                      {status.status === "PAID" ? (
                        <CheckCircle size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {status.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-stroke pb-2 dark:border-strokedark">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Transactions:</span>
                      <span className="font-bold text-black dark:text-white">
                        {status.count}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-stroke pb-2 dark:border-strokedark">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount:</span>
                      <span className="font-bold text-black dark:text-white">
                        Rs. {status.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-stroke pb-2 dark:border-strokedark">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Collected:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        Rs. {status.collected.toLocaleString()}
                      </span>
                    </div>
                    {status.pending > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Pending:</span>
                        <span className="font-bold text-orange-600 dark:text-orange-400">
                          Rs. {status.pending.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NoDataCard icon={Funnel} title="No Payment Status Data" message="No payment status overview available." />
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
              <ShoppingCart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Recent Transactions
            </h3>
          </div>
        </div>
        <div className="p-6">
          {processedData.recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-meta-4">
                    {/* <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                      Payment #
                    </th> */}
                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                      Order
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                      Method
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke dark:divide-strokedark">
                  {processedData.recentTransactions.map((transaction: Payment, index: number) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-meta-4">
                      {/* <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {transaction.paymentNumber.split('-')[0]}
                        </span>
                      </td> */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-black dark:text-white">
                            {transaction.customer?.name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.customer?.phone || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-black dark:text-white">
                          {transaction.order?.orderNumberDisplay || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-black dark:text-white">
                            Rs. {transaction.amount.toLocaleString()}
                          </p>
                          {transaction.paidAmount > 0 && (
                            <p className="text-sm text-green-600 dark:text-green-400">
                              Paid: Rs. {transaction.paidAmount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
                          {transaction.paymentMethod?.replace(/_/g, ' ') || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${transaction.status === "PAID"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : transaction.status === "PENDING"
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                            }`}
                        >
                          {transaction.status === "PAID" ? (
                            <CheckCircle size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(transaction.paymentDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <XCircle className="mb-4 h-12 w-12 text-gray-400" />
              <h4 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">No Recent Transactions</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">No transactions found for the selected period.</p>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}