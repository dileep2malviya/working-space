import Spinner from "../loader/buttonspinner";

export default function CustomButton({
  type = "button",
  isLoading,
  disabled,
  onclick,
  children,
  className
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onclick}
      className={`w-full flex items-center justify-center px-4 py-4 border border-gray-600 rounded-lg text-white placeholder-gray-400 outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${className ?? "bg-gray-700"}`}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}