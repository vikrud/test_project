const fsPromises = require("fs").promises;
const filePath = "./database/users.json";

class UserRepository {
    async readAllUsers() {
        const data = await fsPromises.readFile(filePath);
        const usersArr = await JSON.parse(data);

        return usersArr;
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

        throw new Error(404);
    }

    async readUserById(id) {
        const usersArr = await this.readAllUsers();
        const index = await this.findUserIndexById(id);

        return usersArr[index];
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
        const isSaved = await this.saveFileUsers(usersArr);

        if (!isSaved) {
            throw new Error(500);
        }

        return newUser;
    }

    async updateUser(updatedUser) {
        let usersArr = await this.readAllUsers();
        const userIndex = await this.findUserIndexById(updatedUser.id);

        usersArr[userIndex] = updatedUser;

        const isSaved = await this.saveFileUsers(usersArr);
        if (!isSaved) {
            throw new Error(500);
        }

        return updatedUser;
    }

    async deleteUser(id) {
        let usersArr = await this.readAllUsers();
        const userIndex = await this.findUserIndexById(id);
        const deletedUser = usersArr.splice(userIndex, 1);

        const isSaved = await this.saveFileUsers(usersArr);
        if (!isSaved) {
            throw new Error(500);
        }

        return deletedUser;
    }

    async saveFileUsers(users) {
        const newData = await JSON.stringify(users, null, "\t");
        await fsPromises.writeFile(filePath, newData);

        return true;
    }
}

module.exports = { userRepository: new UserRepository() };
