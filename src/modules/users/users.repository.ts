import { CustomError, customErrors } from '../../../messages/errors';
import { EntityRepository, Repository } from 'typeorm';
import {
  IFilterParams,
  ISortParams,
} from './interfaces/user.search.sort.interface';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { RoleEnum } from './enums/role.enum';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async findUserByEmail(userEmail: string): Promise<User> {
    const userDB = await this.createQueryBuilder('user')
      .select([
        'user.id AS id',
        'user.name AS name',
        'user.surname AS surname',
        'user.email AS email',
        'user.phone AS phone',
        'user.password AS password',
        'user.roleId AS roleId',
      ])
      .where('user.email = :email', { email: userEmail })
      .getRawOne();

    if (!userDB) {
      throw new CustomError(
        customErrors.EMAIL_IS_INCORRECT.message,
        customErrors.EMAIL_IS_INCORRECT.code,
      );
    }

    return userDB;
  }

  async readAllUsers(
    filterParams: IFilterParams,
    sortParams: ISortParams,
    limit: number,
    skip: number,
  ): Promise<User[]> {
    const emailMySql = filterParams.email ? `%${filterParams.email}%` : '%';
    const nameMySql = filterParams.name ? `%${filterParams.name}%` : '%';
    const surnameMySql = filterParams.surname
      ? `%${filterParams.surname}%`
      : '%';
    const sortByMySql = sortParams.sortBy || 'id';
    const orderByMySql = sortParams.orderBy == 'desc' ? 'DESC' : 'ASC';
    const limitMySql = limit || 1e11;
    const roleMySql = filterParams.role;

    const users = await this.createQueryBuilder('user')
      .select([
        'user.id AS id',
        'user.name AS name',
        'user.surname AS surname',
        'user.email AS email',
        'user.phone AS phone',
        'user.password AS password',
        'user.roleId AS roleId',
      ])
      .where('user.email LIKE :email', { email: emailMySql })
      .andWhere('user.name LIKE :name', { name: nameMySql })
      .andWhere('user.surname LIKE :surname', { surname: surnameMySql })
      .andWhere(
        roleMySql === RoleEnum.admin
          ? 'user.roleId IS NOT NULL'
          : 'user.roleId = :role',
        { role: roleMySql },
      )
      .orderBy(sortByMySql, orderByMySql)
      .limit(limitMySql)
      .offset(skip)
      .getRawMany();

    return users;
  }

  async readUserById(userId: number, userRole: RoleEnum): Promise<User[]> {
    const userDB = await this.createQueryBuilder('user')
      .select([
        'user.id AS id',
        'user.name AS name',
        'user.surname AS surname',
        'user.email AS email',
        'user.phone AS phone',
        'user.password AS password',
        'user.roleId AS roleId',
      ])
      .where('user.id = :id', { id: userId })
      .andWhere(
        userRole === RoleEnum.admin
          ? 'user.roleId IS NOT NULL'
          : 'user.roleId = :role',
        { role: userRole },
      )
      .getRawOne();

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
