const express = require("express");
const router = express.Router(); // - /v1/user/
const { userService } = require("./user.service");
const { isEmpty, isArrayWithData } = require("../../utils.js");
const { errorHandler, CustomError } = require("../../errorHandler");
const { MessageToUser } = require("../../userMessage");
const { authenticateLogin } = require("./auth.local.middleware");
const { authenticateJWT } = require(".//auth.jwt.middleware");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

async function extractUserDataFromRequest(request) {
    const params = ["name", "surname", "email", "phone", "password"];

    let user = { id: null };

    params.forEach(function (item) {
        if (request.body[item]) {
            user[item] = request.body[item];
        }
    });

    if (request.params.id) {
        user.id = request.params.id;
    }

    return user;
}

function insertDataIntoResponseObj(data) {
    let responseObj = {
        success: false,
    };

    if (data.type == "error") {
        responseObj.success = false;
        responseObj.error = data.message;
    } else if (isArrayWithData(data)) {
        responseObj.success = true;
        responseObj.data = data;
    } else if (data instanceof MessageToUser) {
        responseObj.success = true;
        responseObj.message = data.message;
    } else if (!isEmpty(data) && data.token) {
        responseObj.success = true;
        responseObj.data = [data];
    }

    return responseObj;
}

router.post("/login", authenticateLogin(), async function (req, res, next) {
    try {
        const userJWT = req.token;
        const responseData = await insertDataIntoResponseObj(userJWT);

        res.status(200).send(responseData);
    } catch (err) {
        next(err);
    }
});

router.get("/", authenticateJWT(), async function (req, res, next) {
    try {
        const users = await userService.readAllUsers();

        const responseData = await insertDataIntoResponseObj(users);

        res.status(200).send(responseData);
    } catch (err) {
        next(err);
    }
});

router.get("/:id", authenticateJWT(), async function (req, res, next) {
    try {
        const id = req.params.id;
        const user = await userService.readOneUser(id);

        const responseData = await insertDataIntoResponseObj(user);

        res.status(200).send(responseData);
    } catch (err) {
        next(err);
    }
});

router.post("/", authenticateJWT(), async function (req, res, next) {
    try {
        if (isEmpty(req.body)) {
            throw new CustomError("EMPTY_NEW_USER_DATA");
        }

        const user = await extractUserDataFromRequest(req);
        await userService.createUser(user);

        const responseData = await insertDataIntoResponseObj(
            new MessageToUser("USER_CREATED_MESSAGE")
        );

        res.status(200).send(responseData);
    } catch (err) {
        next(err);
    }
});

router.put("/:id", authenticateJWT(), async function (req, res, next) {
    try {
        if (isEmpty(req.body)) {
            throw new CustomError("EMPTY_USER_DATA_FOR_UPDATE");
        }

        const user = await extractUserDataFromRequest(req);
        await userService.updateUser(user);

        const responseData = await insertDataIntoResponseObj(
            new MessageToUser("USER_UPDATED_MESSAGE")
        );

        res.status(200).send(responseData);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", authenticateJWT(), async function (req, res, next) {
    try {
        const id = req.params.id;

        await userService.deleteUser(id);

        const responseData = await insertDataIntoResponseObj(
            new MessageToUser("USER_DELETED_MESSAGE")
        );

        res.send(responseData);
    } catch (err) {
        next(err);
    }
});

router.use(async function (err, req, res, next) {
    const error = errorHandler(err);
    const responseData = await insertDataIntoResponseObj(error);

    res.statusCode = error.statusCode;
    res.send(responseData);
    res.end();
});

module.exports = router;
