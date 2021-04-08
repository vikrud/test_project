function errorHandler(err) {
    let handledError = {};

    switch (err.message) {
        case "400":
            handledError.statusCode = 400;
            handledError.end = "Bad Request";
            break;
        case "404":
            handledError.statusCode = 404;
            handledError.end = "User not found";
            break;
        default:
            handledError.statusCode = 500;
            handledError.end = "Server error";
    }

    return handledError;
}

module.exports = { errorHandler };
