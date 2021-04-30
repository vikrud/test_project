import { customError } from 'messages/errors';
import { customErrors } from 'messages/errors';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async findUserByEmail(userEmail: string): Promise<User> {
    const data = await this.find({ where: { email: userEmail } });
    const userDB = data[0];

    if (!userDB) {
      throw new customError(
        customErrors.EMAIL_IS_INCORRECT.message,
        customErrors.EMAIL_IS_INCORRECT.code,
      );
    }

    return userDB;
  }

  async readAllUsers(
    searchParams: any = {},
    sortParams: any = {},
    limit: number,
    skip: number,
  ): Promise<User[]> {
    const emailMySql = searchParams.email ? `%${searchParams.email}%` : '%';
    const nameMySql = searchParams.name ? `%${searchParams.name}%` : '%';
    const surnameMySql = searchParams.surname
      ? `%${searchParams.surname}%`
      : '%';
    const sortByMySql = sortParams.sortBy || 'id';
    const orderByMySql = sortParams.orderBy == 'desc' ? 'DESC' : 'ASC';
    const limitMySql = limit || 1e11;

    const query = `SELECT id, name, surname, email, phone, password
                        FROM user
                        WHERE email LIKE "${emailMySql}" AND
                            name LIKE "${nameMySql}" AND
                            surname LIKE "${surnameMySql}"
                        ORDER BY ${sortByMySql} ${orderByMySql}
                        LIMIT ${skip}, ${limitMySql}`;
    const users = await this.query(query);

    return users;
  }

  async readUserById(userId: number): Promise<User[]> {
    const userDB = await this.findOne(userId);

    if (!userDB) {
      throw new customError(
        customErrors.CANT_FIND_USER_BY_ID.message,
        customErrors.CANT_FIND_USER_BY_ID.code,
      );
    }

    return [userDB];
  }

  async findMaxUserId(): Promise<number> {
    const query = 'SELECT MAX(id) AS MAX_ID FROM user';
    const rawSQL = await this.query(query);
    const maxID: number = rawSQL[0].MAX_ID | 0;

    return maxID;
  }

  async saveNewUser(newUser: CreateUserDto): Promise<any> {
    await this.insert(newUser);
  }

  async updateUser(updatedUserData: UpdateUserDto): Promise<void> {
    let result = await this.update({ id: updatedUserData.id }, updatedUserData);

    if (!result.affected) {
      throw new customError(
        customErrors.CANT_FIND_USER_BY_ID.message,
        customErrors.CANT_FIND_USER_BY_ID.code,
      );
    }
  }

  async deleteUser(idToDelete: number): Promise<void> {
    const result = await this.delete({ id: idToDelete });

    if (!result.affected) {
      throw new customError(
        customErrors.CANT_FIND_USER_BY_ID.message,
        customErrors.CANT_FIND_USER_BY_ID.code,
      );
    }
  }
}
