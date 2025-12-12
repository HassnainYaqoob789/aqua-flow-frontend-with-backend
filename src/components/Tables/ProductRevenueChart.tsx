import React from "react";

interface ProductRevenueItem {
  product: string;
  revenue: number;
}

interface ProductRevenueChartProps {
  data?: ProductRevenueItem[];
}

export default function ProductRevenueChart({
  data = [
    { product: "20L Bottles", revenue: 54720 },
    { product: "10L Bottles", revenue: 18720 },
    { product: "5L Bottles", revenue: 7800 },
  ],
}: ProductRevenueChartProps) {
  const maxRevenue = Math.max(...data.map((item) => item.revenue));

  return (
    <div className="space-y-6">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.product}
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              RS {item.revenue.toLocaleString()}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${(item.revenue / maxRevenue) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}