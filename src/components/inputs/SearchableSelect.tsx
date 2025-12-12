import React, { useRef, useEffect } from "react";

interface Option {
    value: string;
    label: string;
}

interface Props {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: boolean | string;
}

const SearchableSelect: React.FC<Props> = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    error,
}) => {
    const [inputValue, setInputValue] = React.useState("");
    const [open, setOpen] = React.useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Sync display text when value changes
    useEffect(() => {
        const selected = options.find((o) => o.value === value);
        if (selected) setInputValue(selected.label);
    }, [value]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filtered = options.filter((o) =>
        o.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                type="text"
                value={inputValue}
                placeholder={placeholder}
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setOpen(true);
                }}
                className={`w-full rounded-lg border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-700 px-4 py-2 text-sm outline-none dark:text-white cursor-text`}
            />

            {open && (
                <div className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-lg">
                    {filtered.length > 0 ? (
                        filtered.map((opt) => (
                            <div
                                key={opt.value}
                                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                                onMouseDown={() => {
                                    onChange(opt.value);
                                    setInputValue(opt.label);
                                    setOpen(false);
                                }}
                            >
                                {opt.label}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
