const { userRepository } = require("./user.repository");

class UserService {
    async readAllUsers() {
        return userRepository.readAllUsers();
    }
    async readOneUser(id) {
        const user = await userRepository.readUserById(id);
        return user;
    }

    async createUser(newUser) {
        const maxUsersId = await userRepository.findMaxUserId();
        newUser.id = maxUsersId + 1;
        const savedUser = await userRepository.saveNewUser(newUser);
        return savedUser;
    }

    async updateUser(updatedUser) {
        const savedUser = await userRepository.updateUser(updatedUser);
        return savedUser;
    }

    async deleteUser(id) {
        const deletedUser = await userRepository.deleteUser(id);
        return deletedUser;
    }

    async getUser(userBody) {
        let user = {
            id: null,
            name: userBody.body.name,
            surname: userBody.body.surname,
            email: userBody.body.email,
            phone: userBody.body.phone,
        };

        if (userBody.params.id) {
            user.id = userBody.params.id;
        }

        return user;
    }
}

module.exports = { userService: new UserService() };
