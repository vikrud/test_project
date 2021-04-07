const express = require("express");
const fsPromises = require("fs").promises;
const filePath = "./database/users.json";

class UserRepository {
    async readFileUsers() {
        let data = await fsPromises.readFile(filePath);
        const usersArr = await JSON.parse(data);
        return usersArr;
    }

    findUserIndexById(usersArr, id) {
        let userIndex;
        for (let i = 0; i < usersArr.length; i++) {
            if (usersArr[i].id == id) {
                userIndex = i;
                return userIndex;
            }
        }
        throw new Error(404);
    }

    findMaxId(usersArr) {
        let usersId = usersArr.map((usersArr) => usersArr.id);
        let maxId = Math.max(...usersId);
        return maxId;
    }

    deleteUserByIndex(users, index) {
        let user = users.splice(index, 1);
        return user;
    }

    async saveFileUsers(users) {
        let newData = await JSON.stringify(users, null, "\t");
        await fsPromises.writeFile(filePath, newData);
        return true;
    }
}

let userRepository = new UserRepository();

module.exports = userRepository;
