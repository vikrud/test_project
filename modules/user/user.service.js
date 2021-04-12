const { userRepository } = require("./user.repository");

class UserService {
    async readAllUsers() {
        const result = await userRepository.readAllUsers();
        return result;
    }
    async readOneUser(id) {
        const result = await userRepository.readUserById(id);
        return result;
    }

    async createUser(newUser) {
        const maxUsersId = await userRepository.findMaxUserId();
        newUser.id = maxUsersId + 1;
        const result = await userRepository.saveNewUser(newUser);
        return result;
    }

    async updateUser(updatedUser) {
        const result = await userRepository.updateUser(updatedUser);
        return result;
    }

    async deleteUser(id) {
        const result = await userRepository.deleteUser(id);
        return result;
    }
}

module.exports = { userService: new UserService() };
