const CustomDateInput = ({
    labelText,
    placeholder,
    labelCss,
    inputCss,
    error,
    register,
    isDisable = false,
    isMandotry = true,
    min,
    max,
    value,
    onChange,
    name,
}) => {
    return (
        <div className="relative">
            <label
                htmlFor={labelText}
                className={`mb-2 block text-sm font-semibold text-gray-700 ${labelCss ?? ""}`}
            >
                {labelText}
                {isMandotry && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>

            <input
                id={labelText}
                type="date"
                disabled={isDisable}
                min={min}
                max={max}
                name={name}
                value={value}
                onChange={onChange}
                {...register}
                className={`w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all duration-200
                focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                disabled:cursor-not-allowed disabled:bg-gray-100
                ${inputCss ?? ""}
                ${error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""}`}
            />

            {error && (
                <p className="absolute left-0 top-full mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default CustomDateInput;