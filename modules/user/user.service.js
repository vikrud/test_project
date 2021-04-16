const { userRepository } = require("./user.repository");

class UserService {
    async userLogin(usersCred) {
        const result = await userRepository.userLogin(usersCred);
        return result;
    }

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
        await userRepository.saveNewUser(newUser);
    }

    async updateUser(updatedUser) {
        await userRepository.updateUser(updatedUser);
    }

    async deleteUser(id) {
        await userRepository.deleteUser(id);
    }
}

module.exports = { userService: new UserService() };
