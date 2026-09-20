const DB_NAME = "work-spac";

const ActivityAction = Object.freeze({
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    REGISTER: "REGISTER",
    PASSWORD_CHANGED: "PASSWORD_CHANGED",
    PASSWORD_RESET: "PASSWORD_RESET",
    PROFILE_UPDATED: "PROFILE_UPDATED",
    ACCOUNT_DELETED: "ACCOUNT_DELETED",
});

const userFetchflag = {
    isDeleted: false, isVerified: true, isActive: true
};

export { DB_NAME, ActivityAction, userFetchflag };
