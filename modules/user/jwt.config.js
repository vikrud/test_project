const jwt = require("jsonwebtoken");
require("dotenv").config();

async function encodeJWT(userDB) {
    let payload = {
        id: userDB.id,
        iat: Math.floor(Date.now() / 1000),
    };

    const userJWT = await jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
        algorithm: "HS256",
    });

    return userJWT;
}

module.exports = { encodeJWT };
