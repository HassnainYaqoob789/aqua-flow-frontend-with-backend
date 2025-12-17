"use client";

import { ApexOptions } from "apexcharts";
import React from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ChartData {
  name: string;
  value: number;
}

interface ChartThreeProps {
  data: ChartData[];
  colors?: string[];  // Optional, fallback to default if not provided
}

const ChartThree: React.FC<ChartThreeProps> = ({
  data,
  colors = ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF"]
}) => {
  // 1. Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);
  // total = 4 + 0 + 3 = 7

  // 2. Calculate percentage for each slice
  const percentages = data.map(item =>
    total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0"
  );
  // Orders: (4 / 7) * 100 = 57.1%
  // Customers: (0 / 7) * 100 = 0.0%
  // Drivers: (3 / 7) * 100 = 42.9%

  // Dynamic options
  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors,
    labels: data.map(item => item.name),
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "55%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              color: undefined,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 700,
              color: undefined,
              offsetY: 10,
              formatter: function (val) {
                return val.toString();
              },
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              fontSize: "16px",
              fontWeight: 600,
              color: "#9CA3AF",
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return total.toString();
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 280,
          },
        },
      },
    ],
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toString();
        },
      },
    },
  };

  const series = data.map(item => item.value);

  return (
    <div className="w-full">
      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={280}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-y-3 mt-6">
        {data.map((item, index) => (
          <div key={index} className="w-full px-4 sm:w-1/2">
            <div className="flex w-full items-center">
              <span
                className="mr-2 block h-3 w-full max-w-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></span>
              <p className="flex w-full justify-between text-sm font-medium text-gray-800 dark:text-gray-100">
                <span>{item.name}</span>
                <span className="font-semibold">{percentages[index]}%</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartThree;