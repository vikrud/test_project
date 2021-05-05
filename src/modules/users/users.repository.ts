import { CustomError } from 'messages/errors';
import { customErrors } from 'messages/errors';
import { EntityRepository, Repository } from 'typeorm';
import {
  ISearchParams,
  ISortParams,
} from './interfaces/user.search.sort.interface';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

import { User } from './entities/user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async findUserByEmail(userEmail: string): Promise<User> {
    const data = await this.find({ where: { email: userEmail } });
    const userDB = data[0];

    if (!userDB) {
      throw new CustomError(
        customErrors.EMAIL_IS_INCORRECT.message,
        customErrors.EMAIL_IS_INCORRECT.code,
      );
    }

    return userDB;
  }

  async readAllUsers(
    searchParams: ISearchParams,
    sortParams: ISortParams,
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

    const users = await this.createQueryBuilder('user')
      .where('user.email LIKE :email', { email: emailMySql })
      .andWhere('user.name LIKE :name', { name: nameMySql })
      .andWhere('user.surname LIKE :surname', { surname: surnameMySql })
      .orderBy(sortByMySql, orderByMySql)
      .skip(skip)
      .take(limitMySql)
      .getMany();

    return users;
  }

  async readUserById(userId: number): Promise<User[]> {
    const userDB = await this.findOne(userId);

    if (!userDB) {
      throw new CustomError(
        customErrors.CANT_FIND_USER_BY_ID.message,
        customErrors.CANT_FIND_USER_BY_ID.code,
      );
    }

    return [userDB];
  }

  async findMaxUserId(): Promise<number> {
    const rawSQL = await this.createQueryBuilder('user')
      .select('MAX(user.id)', 'MAX_ID')
      .printSql()
      .getRawOne();
    const maxID: number = rawSQL.MAX_ID | 0;

    return maxID;
  }

  async saveNewUser(newUser: CreateUserDto): Promise<void> {
    await this.insert(newUser);
  }

  async updateUser(updatedUserData: UpdateUserDto): Promise<void> {
    const result = await this.update(
      { id: updatedUserData.id },
      updatedUserData,
    );

    if (!result.affected) {
      throw new CustomError(
        customErrors.CANT_FIND_USER_BY_ID.message,
        customErrors.CANT_FIND_USER_BY_ID.code,
      );
    }
  }

  async deleteUser(idToDelete: number): Promise<void> {
    const result = await this.delete({ id: idToDelete });

    if (!result.affected) {
      throw new CustomError(
        customErrors.CANT_FIND_USER_BY_ID.message,
        customErrors.CANT_FIND_USER_BY_ID.code,
      );
    }
  }
}
