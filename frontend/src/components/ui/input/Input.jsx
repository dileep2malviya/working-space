import { Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";


const CustomInput = ({
    type = "text",
    labelText,
    lang,
    is24Hour = false,
    placeholder,
    labelCss,
    inputCss,
    error,
    register,
    isDisable=false,
    isMandotry=true
}) => {
    return (
        <div className="relative">
  <label
    htmlFor={labelText}
    className={`mb-2 block text-sm font-semibold text-gray-700 ${labelCss ?? ""}`}
  >
    {labelText}
    {
        isMandotry && <span className="ml-1 text-red-500">*</span>  
    }
    
  </label>

  <input
    id={labelText}
        type={is24Hour ? "text" : type}
    lang={lang}
        inputMode={is24Hour ? "numeric" : undefined}
        maxLength={is24Hour ? 5 : undefined}
    disabled={isDisable}
        placeholder={placeholder ?? (is24Hour ? "HH:MM" : undefined)}
    {...register}
    className={`w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200
      focus:border-blue-500 focus:ring-4 focus:ring-blue-100
      disabled:cursor-not-allowed disabled:bg-gray-100
      ${inputCss ?? ""}`}
  />

  {error && (
    <p className="absolute left-0 top-full mt-1 text-sm text-red-500">
      {error}
    </p>
  )}
</div>
    )
};

const CustomPasswordInput = ({
    type,
    placeholder,
    labelCss,
    inputCss,
    register,
    error,
    textLabel = 'Password',
}) => {
    const [isView, setIsView] = useState(false)
    const inputId = register.name;

    const togglePassword = () => {
        setIsView((prev) => !prev);
    };

    return (
        <div className="relative">
  <label
    htmlFor={inputId}
    className={`mb-2 block text-sm font-semibold text-gray-700 ${labelCss ?? ""}`}
  >
    {textLabel}
    <span className="ml-1 text-red-500">*</span>
  </label>

  <div
    className={`flex items-center rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm transition-all duration-200
      focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100
      ${inputCss ?? ""}`}
  >
    <input
      id={inputId}
      type={isView ? "text" : type}
      placeholder={placeholder}
      autoComplete="current-password"
      {...register}
      className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 outline-none"
    />

    <button
      type="button"
      onClick={togglePassword}
      className="ml-2 text-gray-400 transition hover:text-blue-600"
    >
      {isView ? (
        <EyeOff size={20} className="cursor-pointer" />
      ) : (
        <Eye size={20} className="cursor-pointer" />
      )}
    </button>
  </div>

  {error && (
    <p className="absolute left-0 top-full mt-1 text-sm text-red-500">
      {error}
    </p>
  )}
</div>
    )
};

const CustomSubmitInput = ({
    type = "submit",
    inputCss,
    value,
    children,
    isLoading
}) => {
    return (
        <div>
            <input
                type={type}
                value={isLoading ? "Loading..." : value}
                disabled={isLoading}
                className={`w-full px-4 py-4 border border-gray-600 rounded-lg text-white placeholder-gray-400 outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${inputCss ?? "bg-gray-700"}`}
            />
            {children}
        </div>
    )
};

const OtpInput = ({
    length = 6,
    value,
    setValue,
    error,
}) => {
    const inputsRef = useRef([]);
    const lastEmittedValue = useRef(value ?? "");
    const [digits, setDigits] = useState(() =>
        Array.from({ length }, (_, index) => value?.[index] ?? "")
    );

    useEffect(() => {
        if (value !== lastEmittedValue.current) {
            setDigits(Array.from({ length }, (_, index) => value?.[index] ?? ""));
            lastEmittedValue.current = value ?? "";
        }
    }, [length, value]);

    const updateDigits = (updatedDigits) => {
        const updatedValue = updatedDigits.join("");
        setDigits(updatedDigits);
        lastEmittedValue.current = updatedValue;
        setValue("otp", updatedValue, {
            shouldValidate: true,
        });
    };

    const handleChange = (index, input) => {
        if (!/^\d?$/.test(input)) return;

        const updatedOtp = [...digits];
        updatedOtp[index] = input;
        updateDigits(updatedOtp);

        if (input && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index,
        e
    ) => {
        if (e.key !== "Backspace") return;

        if (digits[index]) {
            e.preventDefault();
            const updatedOtp = [...digits];
            updatedOtp[index] = "";
            updateDigits(updatedOtp);
        } else if (index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);

        if (!pasted) return;

        const updatedOtp = Array.from({ length }, (_, index) => pasted[index] ?? "");
        updateDigits(updatedOtp);

        inputsRef.current[Math.min(pasted.length, length) - 1]?.focus();
    };

    return (
        <div className="space-y-3">
    <label className="block text-sm font-semibold text-gray-700">
        Verification Code <span className="text-red-500">*</span>
    </label>

    <div className="flex justify-center gap-3">
        {Array.from({ length }).map((_, index) => (
            <input
                key={index}
                ref={(el) => {
                    inputsRef.current[index] = el;
                }}
                value={digits[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                maxLength={1}
                inputMode="numeric"
                className={`
                    h-14 w-14 rounded-xl
                    border ${
                        error ? "border-red-400" : "border-gray-300"
                    }
                    bg-white
                    text-center
                    text-2xl
                    font-semibold
                    text-gray-900
                    shadow-sm
                    transition-all
                    duration-200
                    outline-none
                    hover:border-blue-400
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                    focus:shadow-md
                `}
            />
        ))}
    </div>

    {error && (
        <p className="flex items-center gap-1 text-sm text-red-500">
            {error}
        </p>
    )}
</div>
    );
};

export {
    CustomInput,
    CustomSubmitInput,
    CustomPasswordInput,
    OtpInput
};