"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";  // Added for layout
import dynamic from "next/dynamic";

// Dynamic imports for all charts
const ChartOne = dynamic(() => import("@/components/Charts/ChartOne"), { ssr: false });
const ChartTwo = dynamic(() => import("@/components/Charts/ChartTwo"), { ssr: false });
const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), { ssr: false });

const Charts: React.FC = () => {
  // Dummy data for ChartThree (replace with real)
  const dummyData = [
    { name: "20L Bottles", value: 560 },
    { name: "10L Bottles", value: 340 },
    { name: "5L Bottles", value: 160 },
  ];
  const dummyColors = ["#3C50E0", "#6577F3", "#8FD0EF"];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Charts" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-4">
          <ChartOne />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <ChartTwo />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <ChartThree data={dummyData} colors={dummyColors} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Charts;