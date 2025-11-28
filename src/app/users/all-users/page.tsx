"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, MoreVertical, Eye, AlertCircle, Send, Download, User, Edit, Loader2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { useUsers } from "@/lib/api/servicesHooks";
import { useUserStore } from "@/lib/store/useUserStore";

export type UserRole = "company_user" | "company_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  // optional fields
  password?: string;
  address?: string | null;
  logo?: string | null;
  otp?: string | null;
  tenantId?: string;
  lastActivity?: string;
  updatedAt?: string;
}

export interface CreateUserResponse {
  message: string;
  user: User;
}

export interface GetUsersResponse {
  users: User[];
}

export default function UserManagement() {
    const { data, isLoading, isError } = useUsers();
    console.log("GET USERS API RESPONSE:", data);

    const [localUsers, setLocalUsers] = useState<User[]>([]);
    useEffect(() => {
        if (data?.users) {
            setLocalUsers(data.users);
        }
    }, [data]);

    const users = localUsers;

    const [activeTab, setActiveTab] = useState("All");
    const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (user: User) => {
        setConfirmDelete(user);
    };

    const confirmDeleteUser = () => {
        if (!confirmDelete) return;
        setIsDeleting(true);
        setTimeout(() => {
            setLocalUsers((prevUsers: User[]) => prevUsers.filter((user: User) => user.id !== confirmDelete.id));
            setConfirmDelete(null);
            setIsDeleting(false);
        }, 1000); // Simulate delay
    };

    // Stats
    const totalUsers = users.length;

    const stats = [
        { label: "Total Users", value: totalUsers.toString(),color:'text-gray-900 dark:text-white' },
    ];

    const tabs = [
        `All Users (${totalUsers})`,
    ];

    const filteredUsers = users;

    if (isError) {
        return (
            <DefaultLayout>
                <Breadcrumb pageName="User Management" description="Manage users and roles" />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <AlertCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Users</h3>
                        <p className="text-gray-600 dark:text-gray-300">Failed to fetch users. Please try again later.</p>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="User Management" description="Manage users and roles" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <div className="border-b border-gray-200 bg-white px-3 py-4 dark:border-gray-700 dark:bg-gray-800 sm:px-6 sm:py-8">
                    <div className="flex justify-end">
                        <Link href="/users/add" className="sm:ml-auto">
                            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto">
                                <Plus size={20} />
                                Add User
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="p-3 sm:p-6">
                    {/* Search and Filters */}
                    <div className="mb-6 flex flex-col gap-3 sm:gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by user name..."
                                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 sm:text-sm"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 sm:text-sm">
                            <Filter size={16} className="sm:size-[18px]" />
                            <span>Filter</span>
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-6 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                                <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">{stat.label}</p>
                                <p className={`mt-2 text-lg font-bold sm:text-2xl ${stat.color || "text-gray-900 dark:text-white"}`}>
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Filter Tabs */}
                    <div className="mb-6 flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                        {tabs.map((tab, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveTab(tab.split(" ")[0])}
                                className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${activeTab === tab.split(" ")[0]
                                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Users Table or Loading */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        {isLoading ? (
                            <div className="p-8 text-center">
                                <Loader2 className="mx-auto mb-3 h-12 w-12 animate-spin text-blue-500" />
                                <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
                            </div>
                        ) : (
                            <>
                                <table className="w-full min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700">
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">
                                                User
                                            </th>
                                            <th className="hidden px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm md:table-cell">
                                                Email
                                            </th>
                                            <th className="hidden px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm lg:table-cell">
                                                Created Date
                                            </th>
                                            <th className="hidden px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm md:table-cell">
                                                Role
                                            </th>

                                            <th className="px-3 py-3 text-center text-xs font-semibold text-gray-900 dark:text-white sm:px-6 sm:py-4 sm:text-sm">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredUsers.map((user) => {
                                            const createdDate = new Date(user.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            });
                                            return (
                                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                                                        <p className="text-xs font-medium text-gray-900 dark:text-white sm:text-sm">{user.name}</p>
                                                        <div className="mt-1 space-y-0.5 md:hidden">
                                                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                                                <User className="inline h-3 w-3" /> {user.email}
                                                            </p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-300">Created: {createdDate}</p>
                                                        </div>
                                                    </td>
                                                    <td className="hidden px-3 py-3 sm:px-6 sm:py-4 md:table-cell">
                                                        <p className="flex items-center gap-1 text-xs text-gray-900 dark:text-white sm:text-sm">
                                                            <User size={14} /> {user.email}
                                                        </p>
                                                    </td>
                                                    <td className="hidden px-3 py-3 sm:px-6 sm:py-4 lg:table-cell">
                                                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{createdDate}</p>
                                                    </td>
                                                    <td className="hidden px-3 py-3 sm:px-6 sm:py-4 md:table-cell">
                                                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{user.role}</p>
                                                    </td>

                                                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                                                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                                                            {/* <Link href={`/user/${user.id}`}> */}
                                                                <button className="p-1 text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300">
                                                                    <Edit size={16} className="sm:size-[18px]" />
                                                                </button>
                                                            {/* </Link> */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(user);
                                                                }}
                                                                className="p-1 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                                                title="Delete user"
                                                            >
                                                                <MoreVertical size={16} className="sm:size-[18px]" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* Empty State */}
                                {users.length === 0 && (
                                    <div className="p-8 text-center">
                                        <User className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                        <p className="text-gray-500 dark:text-gray-400">No users found</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Delete Confirmation Modal */}
                    {confirmDelete && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) setConfirmDelete(null);
                            }}
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6">
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Delete User</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Are you sure you want to delete <strong>&quot;{confirmDelete.name}&quot;</strong>? This action cannot be undone.
                                </p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setConfirmDelete(null)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDeleteUser}
                                        disabled={isDeleting}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    >
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
}