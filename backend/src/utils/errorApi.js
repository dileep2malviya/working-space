class ApiError extends Error {
    statusCode;
    data;
    success;
    errors;
    constructor(statusCode, message = "Something went wrong", errors = {}, stack) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

const preparedErrorObject = (errors) => {
  return Object.fromEntries(
    errors.map(({ path, message }) => [path[path.length - 1], message])
  );
};

const throwDuplicateError = (error) => {
    if (error instanceof ApiError) {
        throw error;
    }
    if (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000) {
        throw new ApiError(409, "Username or email already exists");
    }
    throw error;
};

export { ApiError, preparedErrorObject, throwDuplicateError };
