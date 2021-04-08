const express = require("express");
const router = express.Router(); // - /v1/user/
const jsonParser = express.json();
const { isEmpty } = require("../../utils.js");
const { errorHandler } = require("../../messages");
const { userService } = require("./user.service");

router.get("/", async function (req, res) {
    try {
        const users = await userService.readAllUsers();
        res.send(users);
    } catch (err) {
        const error = errorHandler(err);

        res.statusCode = error.statusCode;
        res.end(error.end);
    }
});

router.get("/:id", async function (req, res) {
    try {
        const id = req.params.id;
        const user = await userService.readOneUser(id);

        res.send(user);
    } catch (err) {
        const error = errorHandler(err);

        res.statusCode = error.statusCode;
        res.end(error.end);
    }
});

router.post("/", jsonParser, async function (req, res) {
    try {
        if (isEmpty(req.body)) {
            throw new Error(400);
        }

        let user = await userService.getUser(req);
        const newUser = await userService.createUser(user);

        res.send(newUser);
    } catch (err) {
        const error = errorHandler(err);

        res.statusCode = error.statusCode;
        res.end(error.end);
    }
});

router.put("/:id", jsonParser, async function (req, res) {
    try {
        if (isEmpty(req.body)) {
            throw new Error(400);
        }

        const user = await userService.getUser(req);
        const newUser = await userService.updateUser(user);

        res.send(newUser);
    } catch (err) {
        const error = errorHandler(err);

        res.statusCode = error.statusCode;
        res.end(error.end);
    }
});

router.delete("/:id", async function (req, res) {
    try {
        const id = req.params.id;

        const deletedUser = await userService.deleteUser(id);

        res.send(deletedUser);
    } catch (err) {
        const error = errorHandler(err);

        res.statusCode = error.statusCode;
        res.end(error.end);
    }
});

module.exports = router;
