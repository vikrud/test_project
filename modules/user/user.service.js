const userRepository = require("./user.repository");

class UserService {
    readAllUsers() {
        return userRepository.readFileUsers();
    }
    async readOneUser(id) {
        let users = await userRepository.readFileUsers();
        let userIndex = await userRepository.findUserIndexById(users, id);
        return users[userIndex];
    }

    async createUser(newUser) {
        let users = await userRepository.readFileUsers();
        newUser.id = userRepository.findMaxId(users) + 1;
        users.push(newUser);
        await userRepository.saveFileUsers(users);
        return newUser;
    }

    async updateUser(updatedUser) {
        let users = await userRepository.readFileUsers();
        let userIndex = await userRepository.findUserIndexById(
            users,
            updatedUser.id
        );
        users[userIndex] = updatedUser;
        await userRepository.saveFileUsers(users);
        return updatedUser;
    }

    async deleteUser(id) {
        let users = await userRepository.readFileUsers();
        let userIndex = await userRepository.findUserIndexById(users, id);
        let deletedUser = await userRepository.deleteUserByIndex(
            users,
            userIndex
        );
        await userRepository.saveFileUsers(users);
        return deletedUser;
    }
}

let userService = new UserService();

module.exports = userService;
