import { showToast } from "@/lib/toast"

export const getExpireTimeForOtp = () => {
    const otpResendAllowedAt = Number(sessionStorage.getItem("otpResendAllowedAt"))

    if (otpResendAllowedAt > Date.now()) {
        const retryAfter = Math.ceil(
            (otpResendAllowedAt - Date.now()) / 1000
        );

        showToast.error(
            `Please wait ${retryAfter} second${retryAfter === 1 ? "" : "s"} before requesting another OTP.`
        );

        return true
    }

    return false
}

export const removeSessionStorageItems = (keys) => {
  keys.forEach((key) => sessionStorage.removeItem(key));
}

export const applyServerErrors = (errors, setError) => {
  Object.entries(errors).forEach(([field, message]) => {
    const errorMessage = Array.isArray(message) ? message.join(", ") : message;

    if (errorMessage) {
      setError(field, {
        message: errorMessage,
      });
    }
  });
};

export const convertDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

export const toInputDate = (date) => {
  if (!date) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? ""
    : parsedDate.toISOString().split("T")[0];
};