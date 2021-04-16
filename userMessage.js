const { messages } = require("./messages/messages");

class MessageToUser {
    constructor(messageTitle) {
        this.statusCode = 200;
        this.message = messages[messageTitle];
    }
}

module.exports = { MessageToUser };
