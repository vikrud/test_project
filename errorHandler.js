const { HttpCodes } = require("./messages/httpCodes");
const { customErrors } = require("./messages/errors");

class CustomError {
    constructor(name) {
        this.statusCode = customErrors[name].code;
        this.name = name;
        this.message = customErrors[name].message;
    }
}

function errorHandler(err) {
    let handledError = {
        statusCode: null,
        message: null,
        type: "error",
    };

    if (err instanceof CustomError) {
        handledError.statusCode = err.statusCode;
        handledError.message = err.message;
    } else if (err instanceof Error) {
        handledError.statusCode = Number(err.message);
        handledError.message = HttpCodes[Number(err.message)];
    } else {
        handledError.statusCode = 500;
        handledError.message = HttpCodes[500];
    }

    return handledError;
}

module.exports = {
    errorHandler,
    CustomError,
};
