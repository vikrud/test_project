const customErrors = {
    CANT_FIND_USER_BY_ID: {
        code: 404,
        message: "Can't find user with such ID",
    },
    EMPTY_NEW_USER_DATA: {
        code: 400,
        message: "New user data is empty",
    },
    EMPTY_USER_DATA_FOR_UPDATE: {
        code: 400,
        message: "User data for updating is empty",
    },

    EMAIL_OR_PHONE_ALREADY_IN_USE: {
        code: 400,
        message: "The user's email or phone number is already in use!",
    },
};

module.exports = { customErrors };