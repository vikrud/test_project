const express = require("express");
var router = express.Router(); // - /v1/user/
const jsonParser = express.json();
const { isEmpty, getUser } = require("../../utils.js");
const userService = require("./user.service");

router.get("/", async function (req, res) {
    try {
        let users = await userService.readAllUsers();
        res.send(users);
    } catch (err) {
        res.statusCode = 500;
        res.end("Server error");
    }
});

router.get("/:id", async function (req, res) {
    try {
        const id = req.params.id;

        let user = await userService.readOneUser(id);

        res.send(user);
    } catch (err) {
        if (err.message == 404) {
            res.statusCode = 404;
            res.end("User not found");
        } else {
            res.statusCode = 500;
            res.end("Server error");
        }
    }
});

router.post("/", jsonParser, async function (req, res) {
    try {
        if (isEmpty(req.body)) {
            throw new Error(400);
        }

        let user = getUser(req);

        let newUser = await userService.createUser(user);

        res.send(newUser);
    } catch (err) {
        if (err.message == 400) {
            res.statusCode = 400;
            res.end("Bad Request");
        } else {
            res.statusCode = 500;
            res.end("Server error");
        }
    }
});

router.put("/:id", jsonParser, async function (req, res) {
    try {
        if (isEmpty(req.body)) {
            throw new Error(400);
        }

        let user = getUser(req);

        let newUser = await userService.updateUser(user);

        res.send(newUser);
    } catch (err) {
        switch (err.message) {
            case "400":
                res.statusCode = 400;
                res.end("Bad Request");
                break;
            case "404":
                res.statusCode = 404;
                res.end("User not found");
                break;
            default:
                res.statusCode = 500;
                res.end("Server error");
        }
    }
});

router.delete("/:id", async function (req, res) {
    try {
        const id = req.params.id;

        let deletedUser = await userService.deleteUser(id);

        res.send(deletedUser);
    } catch (err) {
        switch (err.message) {
            case "400":
                res.statusCode = 400;
                res.end("Bad Request");
                break;
            case "404":
                res.statusCode = 404;
                res.end("User not found");
                break;
            default:
                res.statusCode = 500;
                res.end("Server error");
        }
    }
});

module.exports = router;
