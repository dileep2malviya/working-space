export const apiResponse = (statusCode, data = null, message = "Success") => {
    return {
        statusCode,
        data,
        message,
        success: statusCode < 400,
    };
};
