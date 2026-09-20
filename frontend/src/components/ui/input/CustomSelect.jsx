import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";

const CustomSelect = ({
    name,
    control,
    label,
    options = [],
    placeholder = "Select",
    error,
    rules,
    isMandotry=false,
    disabled = false,
    searchable = true,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const selectRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!selectRef.current?.contains(event.target)) {
                setIsOpen(false);
                setSearch("");
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    return (
        <div ref={selectRef} className="relative space-y-2">
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {isMandotry && (
                    <span className="ml-1 text-red-500">*</span>
                )}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => (
                    <>
                        <button
                            type="button"
                            id={name}
                            disabled={disabled}
                            onClick={() => searchable && setIsOpen((current) => !current)}
                            className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left text-gray-900 outline-none transition-all duration-200
                            focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                            disabled:cursor-not-allowed disabled:bg-gray-100
                            ${error ? "border-red-500 focus:ring-red-100 focus:border-red-500" : "border-gray-300"}`}
                        >
                            <span className={!field.value ? "text-gray-400" : ""}>
                                {options.find((option) => String(option.value) === String(field.value))?.label || placeholder}
                            </span>
                            <span className="ml-3 text-gray-400">{isOpen ? "▴" : "▾"}</span>
                        </button>

                        {isOpen && searchable && (
                            <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search..."
                                    autoFocus
                                    className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                <div className="max-h-52 overflow-y-auto">
                                    {options
                                        .filter((option) =>
                                            String(option.label).toLowerCase().includes(search.toLowerCase())
                                        )
                                        .map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    field.onChange(option.value);
                                                    setIsOpen(false);
                                                    setSearch("");
                                                }}
                                                className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-blue-50 ${String(option.value) === String(field.value) ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}

                                    {!options.some((option) =>
                                        String(option.label).toLowerCase().includes(search.toLowerCase())
                                    ) && (
                                        <p className="px-3 py-2 text-sm text-gray-500">No options found.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            />

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default CustomSelect;