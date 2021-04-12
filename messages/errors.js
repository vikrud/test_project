const customErrors = {
    cantFindUserById: {
        code: 404,
        message: "Can't find user with such ID",
    },
    emptyNewUserData: {
        code: 400,
        message: "New user data is empty",
    },
    emptyUserDataForUpdate: {
        code: 400,
        message: "User data for updating is empty",
    },
};

module.exports = { customErrors };
