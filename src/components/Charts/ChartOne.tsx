"use client";

import { ApexOptions } from "apexcharts";
import React from "react";
import dynamic from "next/dynamic";
import { formatAmountRs } from "@/lib/utils/helperFunctions/formatAmountRs";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ProductDataset {
  productId: string;
  productName: string;
  data: number[];
}

interface SalesChartData {
  labels: string[];
  datasets: ProductDataset[];
}

interface ChartOneProps {
  salesData?: SalesChartData;
}

const ChartOne: React.FC<ChartOneProps> = ({ salesData }) => {
  // Categories (x-axis labels)
  const categories = salesData?.labels || [
    "Sep", "Oct", "Nov", "Dec", "Jan", "Feb",
    "Mar", "Apr", "May", "Jun", "Jul", "Aug",
  ];

  // Transform datasets into ApexCharts series
  const series = React.useMemo(() => {
    if (salesData?.datasets && salesData.datasets.length > 0) {
      return salesData.datasets.map((dataset) => ({
        name: dataset.productName,
        data: dataset.data,
      }));
    }
    // Fallback data
    return [];
  }, [salesData]);

  // Max y-axis value with 20% padding
  const maxValue = React.useMemo(() => {
    const allValues = series.flatMap(s => s.data);
    const max = Math.max(...allValues);
    return max > 0 ? Math.ceil(max * 1.2) : 100;
  }, [series]);

  // Colors for each product line
  const colors = React.useMemo(() => {
    const baseColors = ["#3C50E0", "#80CAEE", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
    return series.map((_, index) => baseColors[index % baseColors.length]);
  }, [series]);

  // ApexCharts options
  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontSize: "14px",
      fontFamily: "Satoshi, sans-serif",
    },
    colors: colors,
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: { show: false },
    },
    responsive: [
      { breakpoint: 1024, options: { chart: { height: 300 } } },
      { breakpoint: 1366, options: { chart: { height: 350 } } },
    ],
    stroke: { width: 2, curve: "smooth" },
    grid: {
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: colors,
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: { sizeOffset: 5 },
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: "Revenue (Rs)",
        style: { fontSize: "12px", fontWeight: 500 },
      },
      min: 0,
      max: maxValue,
      labels: {
        formatter: function (val) {
          return formatAmountRs(val, { currency: true }); // <- formatted y-axis
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (val) {
          return formatAmountRs(val, { currency: true }); // <- formatted tooltip
        },
      },
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
        width="100%"
      />
    </div>
  );
};

export default ChartOne;
