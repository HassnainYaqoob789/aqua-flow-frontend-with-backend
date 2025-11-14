"use client";

import { useState } from "react";
import Link from "next/link";
import ClickOutside from "@/components/ClickOutside";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/store/useAuthStore";
import Cookies from "js-cookie";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userData = Cookies.get("user");
  const parsedUser = userData ? JSON.parse(userData) : null;

  const name = parsedUser?.name || "User";
  const role = parsedUser?.role || "Member";

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">

      {/* Toggle Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {name}
          </span>
          <span className="block text-xs text-green-600 dark:text-green-400">{role}</span>
        </span>

        <span className="h-12 w-12 rounded-full bg-[#333A48] 
        text-white flex items-center justify-center font-semibold text-lg uppercase shadow-sm">
          {name.slice(0, 1)}
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-4 w-64 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

          {/* User info inside dropdown */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-stroke dark:border-strokedark">
            <span className="h-12 w-12 rounded-full bg-[#333A48] 
            text-white flex items-center justify-center font-semibold text-lg uppercase shadow-sm">
              {name.slice(0, 1)}
            </span>

            <div>
              <p className="text-sm font-medium text-black dark:text-white">{name}</p>
              <p className="text-xs text-green-600 dark:text-green-400">{role}</p>
            </div>
          </div>

          {/* Change Password */}
          <ul className="flex flex-col border-b border-stroke px-6 py-3 dark:border-strokedark">
            <li>
              <Link
                href="#"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <svg className="fill-current" width="22" height="22" viewBox="0 0 22 22">
                  <path d="M17.6687 1.44374 ... (trimmed)" />
                </svg>
                Change Password
              </Link>
            </li>
          </ul>

          {/* Logout */}
          <button
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base w-full"
            onClick={handleLogout}
          >
            <svg className="fill-current" width="22" height="22" viewBox="0 0 22 22">
              <path d="M15.5375 0.618744 ... (trimmed)" />
              <path d="M6.05001 11.7563 ... (trimmed)" />
            </svg>
            Log Out
          </button>
        </div>
      )}

    </ClickOutside>
  );
};

export default DropdownUser;
