"use client";
import Image from "next/image";

export interface ColumnType<T> {
    title: string;
    dataIndex?: keyof T;
    key: string;
    className?: string;
    render?: (value: any, record: T) => React.ReactNode;
}

interface ReusableTableProps<T> {
    columns: ColumnType<T>[];
    dataSource: T[];
    rowKey?: keyof T;
}

const ReusableTable = <T extends object>({
    columns,
    dataSource,
    rowKey,
}: ReusableTableProps<T>) => {
    return (
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-col">

                {/* HEADER */}
                <div className="grid grid-cols-3 sm:grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
                    {columns.map((col) => (
                        <div key={col.key} className="p-2.5 xl:p-5 text-center">
                            <h5 className="text-sm font-medium uppercase">{col.title}</h5>
                        </div>
                    ))}
                </div>

                {/* BODY */}
                {dataSource.map((row, index) => (
                    <div
                        key={rowKey ? (row[rowKey] as string) : index}
                        className={`grid grid-cols-3 sm:grid-cols-5 ${index !== dataSource.length - 1
                                ? "border-b border-stroke dark:border-strokedark"
                                : ""
                            }`}
                    >
                        {columns.map((col) => {
                            const value = col.dataIndex ? row[col.dataIndex] : undefined;
                            return (
                                <div
                                    key={col.key}
                                    className="flex items-center justify-center p-2.5 xl:p-5"
                                >
                                    {col.render ? col.render(value, row) : (value as React.ReactNode)}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReusableTable;
