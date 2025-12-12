"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import sideBarlogo from "/public/images/Scimg.png";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  DollarSign,
  Warehouse,
  FileText,
  PackageSearch,
  Settings
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "DASHBOARD",
    menuItems: [
      {
        icon: <LayoutDashboard className="h-5 w-5" />,
        label: "Dashboard",
        route: "/",
      },
    ],
  },

  {
    name: "ORDERS",
    menuItems: [
      {
        icon: <Package className="h-5 w-5" />,
        label: "All Orders",
        route: "/order/all-orders",
      },
    ],
  },
  {
    name: "PEOPLE & LOGISTICS",
    menuItems: [
      {
        icon: <Users className="h-5 w-5" />,
        label: "All Customers",
        route: "/customer/all-customers",
      },
      {
        icon: <Truck className="h-5 w-5" />,
        label: "All Drivers",
        route: "/driver/all-driver-routes",
      },
      {
        icon: <Truck className="h-5 w-5" />,
        label: "Delivery Operations",
        route: "/delivery-operations",
      },
      {
        icon: <Truck className="h-5 w-5" />,
        label: "Zone",
        route: "/zone/all-zone",
      },
    ],
  },
  {
    name: "PRODUCTS",
    menuItems: [
      {
        icon: <PackageSearch className="h-5 w-5" />,
        label: "All Products",
        route: "/products/all-products",
      },
    ],
  },
  {
    name: "FINANCE & REPORTS",
    menuItems: [
      {
        icon: <Warehouse className="h-5 w-5" />,
        label: "Inventory",
        route: "/inventory/all-inventory",
      },
      // {
      //   icon: <Warehouse className="h-5 w-5" />,
      //   label: "Payments",
      //   route: "/inventory/all-inventory",
      // },

      // {
      //   icon: <DollarSign className="h-5 w-5" />,
      //   label: "All Expenses",
      //   route: "/expenses/all-expenses",
      // },
      // {
      //   icon: <FileText className="h-5 w-5" />,
      //   label: "Billing & Recoveries",
      //   route: "/billing-recoveries",
      // },

      {
        icon: <FileText className="h-5 w-5" />,
        label: "Billing & Reports",
        route: "/reports",
      },
    ],
  },
  {
    name: "SETTING",
    menuItems: [
      {
        icon: <Settings className="h-5 w-5" />,
        label: "Users",
        route: "/users/all-users",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* SIDEBAR HEADER */}
        <div
          className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5"
          style={{ alignSelf: "center", height: "88px" }}
        >
          <Link href="/">
            <Image
              src={sideBarlogo}
              alt="Logo"
              style={{ objectFit: "contain", width: "197px" }}
              priority
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* SIDEBAR HEADER */}

        {/* SIDEBAR CONTENT */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-4 pt-0 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                // add spacing only between groups so layout matches original spacing
                className={groupIndex === 0 ? "first-group" : "mt-6"}
              >
                {/* Using the original heading spacing so alignment matches previous layout */}
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
