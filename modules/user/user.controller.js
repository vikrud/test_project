const express = require("express");
var router = express.Router(); // - /v1/user/

const filePath = "./database/users.json";
const jsonParser = express.json();
const fs = require("fs");

//получение всех пользователей
router.get("/", function (req, res) {
    fs.readFile(filePath, function (err, content) {
        if (err) {
            res.statusCode = 500;
            res.end("Server error");
            return;
        }

        const users = JSON.parse(content);
        res.send(users);
    });
});

//получение конкретного пользователя
router.get("/:id", function (req, res) {
    const id = req.params.id;
    let userById = null;

    fs.readFile(filePath, function (err, content) {
        if (err) {
            res.statusCode = 500;
            res.end("Server error");
            return;
        }

        const users = JSON.parse(content);
        for (let user of users) {
            if (user.id == id) {
                userById = user;
                break;
            }
        }

        if (userById) {
            res.send(userById);
        } else {
            res.statusCode = 404;
            res.end("User not found");
        }
    });
});

//создание пользователя
router.post("/", function (req, res) {
    res.send("post");
});

//обновление пользователя
router.put("/", function (req, res) {
    res.send("put");
});

//удаление пользователя
router.delete("/", function (req, res) {
    res.send("delete");
});

module.exports = router;
