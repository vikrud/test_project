const { userRepository } = require("./user.repository");
const { encodeJWT } = require("./jwt.config");
const { CustomError } = require("../../errorHandler");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class UserService {
    async userLogin(email, password) {
        const userDB = await userRepository.findUserByEmail(email);

        const matchLoginPass = await bcrypt.compare(password, userDB.password);

        if (!matchLoginPass) {
            throw new CustomError("PASSWORD_IS_INCORRECT");
        }

        const userToken = await encodeJWT(userDB);

        return { token: userToken };
    }

    async readAllUsers(searchParams, sortParams, limit, skip) {
        const result = await userRepository.readAllUsers(
            searchParams,
            sortParams,
            limit,
            skip
        );
        return result;
    }
    async readOneUser(id) {
        const result = await userRepository.readUserById(id);
        return result;
    }

    async createUser(newUser) {
        const maxUsersId = await userRepository.findMaxUserId();
        newUser.id = maxUsersId + 1;

        const passwordHash = await bcrypt.hash(newUser.password, saltRounds);
        newUser.password = passwordHash;

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
