const mysql = require("mysql2");
const { CustomError } = require("../../errorHandler");

const mysql_config = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DB,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
};

const pool = mysql.createPool(mysql_config);
const promisePool = pool.promise();

class UserRepository {
    async findUserByEmail(userEmail) {
        const query =
            "SELECT id, name, surname, email, phone, password FROM users WHERE email=?";
        const [rows] = await promisePool.query(query, userEmail);

        const userDB = rows[0];

        if (!userDB) {
            throw new CustomError("EMAIL_IS_INCORRECT");
        }

        return userDB;
    }

    async readAllUsers(searchParams = {}, sortParams = {}, limit, skip) {
        const email = searchParams.email ? "%" + searchParams.email + "%" : "%";
        const name = searchParams.name ? "%" + searchParams.name + "%" : "%";
        const surname = searchParams.surname
            ? "%" + searchParams.surname + "%"
            : "%";
        const sortBy = sortParams.sortBy || "id";
        const orderBy = sortParams.orderBy == "desc" ? "DESC" : "ASC";
        const limitMySql = limit || 1e11;

        const query = `SELECT id, name, surname, email, phone, password
                        FROM users
                        WHERE email LIKE ? AND
                            name LIKE ? AND
                            surname LIKE ?
                        ORDER BY ${sortBy} ${orderBy}
                        LIMIT ?, ?`;
        const [rows] = await promisePool.query(query, [
            email,
            name,
            surname,
            skip,
            limitMySql,
        ]);

        return rows;
    }

    async readUserById(userId) {
        const query =
            "SELECT id, name, surname, email, phone, password FROM users WHERE id=?";
        const [rows] = await promisePool.query(query, userId);
        const userDB = rows[0];

        if (!userDB) {
            throw new CustomError("CANT_FIND_USER_BY_ID");
        }

        return [userDB];
    }

    async findMaxUserId() {
        const query = "SELECT MAX(id) AS MAX_ID FROM users";
        const [rows] = await promisePool.query(query);
        const maxId = rows[0].MAX_ID;

        return maxId;
    }

    async saveNewUser(newUser) {
        const query = "INSERT INTO users SET ?";
        await promisePool.query(query, newUser);
    }

    async updateUser(updatedUserData) {
        const query = "UPDATE users SET ? WHERE id=?";
        const [rows] = await promisePool.query(query, [
            updatedUserData,
            updatedUserData.id,
        ]);

        if (!rows.affectedRows) {
            throw new CustomError("CANT_FIND_USER_BY_ID");
        }
    }

    async deleteUser(id) {
        const query = "DELETE FROM users WHERE id=?";
        const [rows] = await promisePool.query(query, id);

        if (!rows.affectedRows) {
            throw new CustomError("CANT_FIND_USER_BY_ID");
        }
    }
}

module.exports = { userRepository: new UserRepository() };
