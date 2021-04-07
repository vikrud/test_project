const express = require("express");
var router = express.Router(); // - /v1/user/
const fsPromises = require("fs").promises;

const filePath = "./database/users.json";
const jsonParser = express.json();
const fs = require("fs");

function isEmpty(obj) {
    for (let key in obj) {
        return false;
    }
    return true;
}

//получение всех пользователей
router.get("/", async function (req, res) {
    try {
        let data = await fsPromises.readFile(filePath);
        const users = await JSON.parse(data);
        res.send(users);
    } catch (err) {
        res.statusCode = 500;
        res.end("Server error");
    }
});

//получение конкретного пользователя
router.get("/:id", async function (req, res) {
    try {
        const id = req.params.id;
        let userById;

        let data = await fsPromises.readFile(filePath);
        const users = await JSON.parse(data);

        for (let user of users) {
            if (user.id == id) {
                userById = user;
                break;
            }
        }

        if (userById) {
            res.send(userById);
        } else {
            throw new Error(404);
        }
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

//создание пользователя
router.post("/", jsonParser, async function (req, res) {
    try {
        if (isEmpty(req.body)) {
            throw new Error(400);
        }

        const userName = req.body.name;
        const userSurname = req.body.surname;
        const userEmail = req.body.email;
        const userPhone = req.body.phone;
        let userNewId;

        let data = await fsPromises.readFile(filePath);
        const users = await JSON.parse(data);

        let maxId = Math.max(...users.map((user) => user.id));
        userNewId = maxId + 1;

        let newUser = {
            id: userNewId,
            name: userName,
            surname: userSurname,
            email: userEmail,
            phone: userPhone,
        };

        users.push(newUser);
        let newData = await JSON.stringify(users, null, "\t");
        await fsPromises.writeFile(filePath, newData);

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

//обновление пользователя
router.put("/:id", jsonParser, async function (req, res) {
    try {
        if (isEmpty(req.body)) {
            throw new Error(400);
        }

        let userIndex;

        const id = req.params.id;
        const userName = req.body.name;
        const userSurname = req.body.surname;
        const userEmail = req.body.email;
        const userPhone = req.body.phone;

        let data = await fsPromises.readFile(filePath);
        let users = await JSON.parse(data);

        for (i = 0; i < users.length; i++) {
            if (users[i].id == id) {
                userIndex = i;
                break;
            }
        }

        if (userIndex) {
            users[userIndex] = {
                id: id,
                name: userName,
                surname: userSurname,
                email: userEmail,
                phone: userPhone,
            };
        } else {
            throw new Error(404);
        }

        let newData = await JSON.stringify(users, null, "\t");
        await fsPromises.writeFile(filePath, newData);
        res.send(users[userIndex]);
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

//удаление пользователя
router.delete(["/", "/:id"], async function (req, res) {
    try {
        const id = req.params.id;
        let userIndex = -1;

        if (!id) {
            throw new Error(400);
        }

        let data = await fsPromises.readFile(filePath);
        let users = await JSON.parse(data);

        for (i = 0; i < users.length; i++) {
            if (users[i].id == id) {
                userIndex = i;
                break;
            }
        }

        if (userIndex > -1) {
            const user = users.splice(userIndex, 1);
            let newData = JSON.stringify(users, null, "\t");
            await fsPromises.writeFile(filePath, newData);
            res.send(user);
        } else {
            throw new Error(404);
        }
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
