const fsPromises = require("fs").promises;
const filePath = "./database/users.json";
const { CustomError } = require("../../errorHandler");
const { isArrayWithData } = require("../../utils");

class UserRepository {
    async readAllUsers() {
        const data = await fsPromises.readFile(filePath);
        const usersArr = await JSON.parse(data);

        if (isArrayWithData(usersArr)) {
            return usersArr;
        } else {
            throw new Error(500);
        }
    }

    async findUserIndexById(id) {
        const usersArr = await this.readAllUsers();
        let userIndex;

        for (let i = 0; i < usersArr.length; i++) {
            if (usersArr[i].id == id) {
                userIndex = i;
                return userIndex;
            }
        }

        throw new CustomError("cantFindUserById");
    }

    async readUserById(id) {
        const usersArr = await this.readAllUsers();
        const index = await this.findUserIndexById(id);

        return [usersArr[index]];
    }

    async findMaxUserId() {
        const usersArr = await this.readAllUsers();
        const usersIdArr = usersArr.map((usersArr) => usersArr.id);
        const maxId = Math.max(...usersIdArr);

        return maxId;
    }

    async saveNewUser(newUser) {
        let usersArr = await this.readAllUsers();
        usersArr.push(newUser);

        await this.saveFileUsers(usersArr);

        return [newUser];
    }

    async updateUser(updatedUser) {
        const usersArr = await this.readAllUsers();
        const userIndex = await this.findUserIndexById(updatedUser.id);

        usersArr[userIndex] = updatedUser;

        await this.saveFileUsers(usersArr);

        return [updatedUser];
    }

    async deleteUser(id) {
        const usersArr = await this.readAllUsers();
        const userIndex = await this.findUserIndexById(id);
        const deletedUser = usersArr.splice(userIndex, 1);

        await this.saveFileUsers(usersArr);

        return deletedUser;
    }

    async saveFileUsers(users) {
        const newData = await JSON.stringify(users, null, "\t");
        const isSaved = await fsPromises.writeFile(filePath, newData);

        if (isSaved) {
            throw new Error(500);
        }

        return true;
    }
}

module.exports = { userRepository: new UserRepository() };
