const { HttpCodes } = require("./messages/httpCodes");
const { customErrors } = require("./messages/errors");
const { messages } = require("./messages/messages");

class MessageToUser {
    constructor(name) {
        this.statusCode = messages[name].code;
        this.name = name;
        this.message = messages[name].message;
    }
}

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
        type: null,
    };

    if (err instanceof MessageToUser) {
        handledError.statusCode = err.statusCode;
        handledError.message = err.message;
        handledError.type = "message";
    } else if (err instanceof CustomError) {
        handledError.statusCode = err.statusCode;
        handledError.message = err.message;
        handledError.type = "error";
    } else if (err instanceof Error) {
        handledError.statusCode = Number(err.message);
        handledError.message = HttpCodes[Number(err.message)];
        handledError.type = "error";
    } else {
        handledError.statusCode = 500;
        handledError.message = HttpCodes[500];
        handledError.type = "error";
    }

    return handledError;
}

module.exports = {
    errorHandler,
    MessageToUser,
    CustomError,
};
