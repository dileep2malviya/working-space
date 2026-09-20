const retryableCodes = new Set([
    'ECONNRESET',
    'EPIPE',
    'ETIMEDOUT',
    'EAI_AGAIN',
    'ECONNREFUSED',
    'ENOTFOUND',
    'ECONNABORTED',
    'EHOSTUNREACH',
]);

const shouldRetry = (code) => {
    if (!code) return false;
    return retryableCodes.has(String(code).toUpperCase());
};

export { shouldRetry };
