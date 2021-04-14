const express = require("express");
const router = express.Router(); // - /v1/user/
const jsonParser = express.json();
const { userService } = require("./user.service");
const { isEmpty, isArrayWithData } = require("../../utils.js");
const { errorHandler, CustomError } = require("../../errorHandler");
const { MessageToUser } = require("../../userMessage");

function extractUserDataFromRequest(request) {
    let user = {
        id: null,
        name: request.body.name,
        surname: request.body.surname,
        email: request.body.email,
        phone: request.body.phone,
    };

    if (request.params.id) {
        user.id = request.params.id;
    }

    return user;
}

function insertDataIntoResponseObj(data) {
    let responseObj = {
        success: false,
    };
    console.log(data);
    if (data.type == "error") {
        responseObj.success = false;
        responseObj.error = data.message;
    } else if (isArrayWithData(data)) {
        responseObj.success = true;
        responseObj.data = data;
    } else if (data instanceof MessageToUser) {
        responseObj.success = true;
        responseObj.message = data.message;
    }

    return responseObj;
}

router.get("/", async function (req, res) {
    try {
        const users = await userService.readAllUsers();

        const responseData = await insertDataIntoResponseObj(users);

        res.status(200).send(responseData);
    } catch (err) {
        const error = errorHandler(err);

        const responseData = await insertDataIntoResponseObj(error);

        res.statusCode = error.statusCode;
        res.send(responseData);
        res.end();
    }
});

router.get("/:id", async function (req, res) {
    try {
        const id = req.params.id;
        const user = await userService.readOneUser(id);

        const responseData = await insertDataIntoResponseObj(user);

        res.status(200).send(responseData);
    } catch (err) {
        const error = errorHandler(err);
        const responseData = await insertDataIntoResponseObj(error);

        res.statusCode = error.statusCode;
        res.send(responseData);
        res.end();
    }
});

router.post("/", jsonParser, async function (req, res) {
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
        const error = errorHandler(err);
        const responseData = await insertDataIntoResponseObj(error);

        res.statusCode = error.statusCode;
        res.send(responseData);
        res.end();
    }
});

router.put("/:id", jsonParser, async function (req, res) {
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
        const error = errorHandler(err);
        const responseData = await insertDataIntoResponseObj(error);

        res.statusCode = error.statusCode;
        res.send(responseData);
        res.end();
    }
});

router.delete("/:id", async function (req, res) {
    try {
        const id = req.params.id;

        await userService.deleteUser(id);

        const responseData = await insertDataIntoResponseObj(
            new MessageToUser("USER_DELETED_MESSAGE")
        );

        res.send(responseData);
    } catch (err) {
        const error = errorHandler(err);
        const responseData = await insertDataIntoResponseObj(error);

        res.statusCode = error.statusCode;
        res.send(responseData);
        res.end();
    }
});

module.exports = router;
