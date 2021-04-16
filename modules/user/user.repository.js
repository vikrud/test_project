const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { CustomError } = require("../../errorHandler");
const { encodeJWT } = require("./jwt.config");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userScheme = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
const UserModel = mongoose.model("User", userScheme);

const userAggregateForm = {
    _id: false,
    id: true,
    name: true,
    surname: true,
    email: true,
    phone: true,
    password: true,
};

class UserRepository {
    async userLogin(userCred) {
        const userDB = await UserModel.findOne(
            { email: userCred.email },
            userAggregateForm
        );

        if (!userDB) {
            throw new CustomError("EMAIL_IS_INCORRECT");
        }

        const matchLoginPass = await bcrypt.compare(
            userCred.password,
            userDB.password
        );

        if (matchLoginPass) {
            const userToken = await encodeJWT(userDB);

            return { token: userToken };
        }

        throw new CustomError("PASSWORD_IS_INCORRECT");
    }

    async readAllUsers() {
        const usersArr = await UserModel.find({}, userAggregateForm);

        return usersArr;
    }

    async findMongoIdByUserId(userId) {
        const user = await UserModel.findOne({ id: userId });

        if (!user) {
            throw new CustomError("CANT_FIND_USER_BY_ID");
        }

        const mongoId = user._id;

        return mongoId;
    }

    async readUserById(userId) {
        const user = await UserModel.findOne({ id: userId }, userAggregateForm);

        if (!user) {
            throw new CustomError("CANT_FIND_USER_BY_ID");
        }

        return [user];
    }

    async findMaxUserId() {
        const usersArr = await this.readAllUsers();
        const usersIdArr = usersArr.map((usersArr) => usersArr.id);
        const maxId = Math.max(...usersIdArr);

        return maxId;
    }

    async saveNewUser(newUser) {
        newUser.password = await bcrypt.hash(newUser.password, saltRounds);
        const newMongoUser = new UserModel(newUser);
        await newMongoUser.save();
        const savedUser = await UserModel.findOne(newMongoUser);

        if (!savedUser) {
            throw new Error(500);
        }
    }

    async updateUser(updatedUserData) {
        const mongoId = await this.findMongoIdByUserId(updatedUserData.id);
        const updatedUser = await UserModel.findByIdAndUpdate(
            mongoId,
            updatedUserData,
            { new: true, select: userAggregateForm }
        );

        if (!updatedUser) {
            throw new Error(500);
        }
    }

    async deleteUser(id) {
        const mongoId = await this.findMongoIdByUserId(id);
        const deletedUser = await UserModel.findByIdAndDelete(mongoId, {
            select: userAggregateForm,
        });

        if (!deletedUser) {
            throw new Error(500);
        }
    }
}

module.exports = { userRepository: new UserRepository() };
