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
    let userById;

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
router.post("/", jsonParser, function (req, res) {
    if (!req.body) {
        res.statusCode = 400;
        res.end("Bad Request");
    }

    const userName = req.body.name;
    const userSurname = req.body.surname;
    const userEmail = req.body.email;
    const userPhone = req.body.phone;
    let userNewId;

    fs.readFile(filePath, function (err, content) {
        if (err) {
            res.statusCode = 500;
            res.end("Server error");
            return;
        }

        let users = JSON.parse(content);
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
        data = JSON.stringify(users, null, "\t");

        fs.writeFile("./database/users.json", data, function (err, content) {
            if (err) {
                res.statusCode = 500;
                res.end("Server error");
                return;
            }

            res.send(newUser);
        });
    });
});

//обновление пользователя
router.put("/:id", jsonParser, function (req, res) {
    const id = req.params.id;
    let userIndex;

    if (!req.body) {
        res.statusCode = 400;
        res.end("Bad Request");
    }

    const userName = req.body.name;
    const userSurname = req.body.surname;
    const userEmail = req.body.email;
    const userPhone = req.body.phone;

    fs.readFile(filePath, function (err, content) {
        if (err) {
            res.statusCode = 500;
            res.end("Server error");
            return;
        }

        let users = JSON.parse(content);

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

            data = JSON.stringify(users, null, "\t");

            fs.writeFile(
                "./database/users.json",
                data,
                function (err, content) {
                    if (err) {
                        res.statusCode = 500;
                        res.end("Server error");
                        return;
                    }

                    res.send(users[userNumInArr]);
                }
            );
        } else {
            res.statusCode = 404;
            res.end("User not found");
        }
    });
});

//удаление пользователя
router.delete("/:id", function (req, res) {
    const id = req.params.id;
    let userIndex = -1;

    fs.readFile(filePath, function (err, content) {
        if (err) {
            res.statusCode = 500;
            res.end("Server error");
            return;
        }

        let users = JSON.parse(content);

        for (i = 0; i < users.length; i++) {
            if (users[i].id == id) {
                userIndex = i;
                break;
            }
        }
        if (userIndex > -1) {
            const user = users.splice(userIndex, 1);

            data = JSON.stringify(users, null, "\t");

            fs.writeFile(
                "./database/users.json",
                data,
                function (err, content) {
                    if (err) {
                        res.statusCode = 500;
                        res.end("Server error");
                        return;
                    }

                    res.send(user);
                }
            );
        } else {
            res.statusCode = 404;
            res.end("User not found");
        }
    });
});

module.exports = router;
