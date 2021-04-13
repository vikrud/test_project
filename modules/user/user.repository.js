const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { CustomError } = require("../../errorHandler");
require("dotenv").config();
const url = process.env.MONGODB_URL;

const userScheme = new Schema({
    id: Number,
    name: String,
    surname: String,
    email: String,
    phone: Number,
});
const UserModel = mongoose.model("User", userScheme);

const userAggregateForm = {
    _id: 0,
    id: 1,
    name: 1,
    surname: 1,
    email: 1,
    phone: 1,
};

mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

class UserRepository {
    async readAllUsers() {
        const usersArr = await UserModel.find({}, userAggregateForm);

        return usersArr;
    }

    async findMongoIdByUserId(userId) {
        const user = await UserModel.findOne({ id: userId }, { _id: 1 });

        if (!user) {
            throw new CustomError("CANT_FIND_USER_BY_ID");
        }

        const mongoId = user._id;

        return mongoId;
    }

    async readUserById(userId) {
        const mongoId = await this.findMongoIdByUserId(userId);
        const user = await UserModel.findById(mongoId, userAggregateForm);

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
        const newMongoUser = new UserModel(newUser);
        await newMongoUser.save();
        const savedUser = await UserModel.findOne(newMongoUser);

        if (!savedUser) {
            throw new Error(500);
        }

        return [savedUser];
    }

    async updateUser(updatedUserData) {
        mongoose.set("useFindAndModify", false);
        const mongoId = await this.findMongoIdByUserId(updatedUserData.id);
        const updatedUser = await UserModel.findByIdAndUpdate(
            mongoId,
            updatedUserData,
            { new: true, select: userAggregateForm }
        );

        return [updatedUser];
    }

    async deleteUser(id) {
        const mongoId = await this.findMongoIdByUserId(id);
        const deletedUser = await UserModel.findByIdAndDelete(mongoId, {
            select: userAggregateForm,
        });

        return [deletedUser];
    }
}

module.exports = { userRepository: new UserRepository() };
