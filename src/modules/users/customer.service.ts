import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { saltRounds } from './constants';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import {
  IFilterParams,
  ISortParams,
} from './interfaces/user.search.sort.interface';
import { ClientProxy } from '@nestjs/microservices';
import { RoleEnum } from './enums/role.enum';
import { IUserService } from './interfaces/user.service.interface';

@Injectable()
export class CustomersService implements IUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject('SUBSCRIBERS_SERVICE') private readonly client: ClientProxy,
  ) {}

  async userLogin(email: string): Promise<User> {
    const userDB = await this.usersRepository.findUserByEmail(email);

    return userDB;
  }

  async readAllUsers(
    filterParams: IFilterParams,
    sortParams: ISortParams,
    limit: number,
    skip: number,
  ): Promise<User[]> {
    filterParams.role = RoleEnum.customer;

    const users = await this.usersRepository.readAllUsers(
      filterParams,
      sortParams,
      limit,
      skip,
    );

    return users;
  }

  async readOneUser(id: number): Promise<User[]> {
    const role = RoleEnum.customer;
    const user = await this.usersRepository.readUserById(id, role);
    return user;
  }

  async createUser(newUser: CreateUserDto): Promise<void> {
    const maxUsersId = await this.usersRepository.findMaxUserId();
    newUser.id = maxUsersId + 1;

    const passwordHash = await bcrypt.hash(newUser.password, saltRounds);
    newUser.password = passwordHash;

    await this.usersRepository.saveNewUser(newUser);
  }

  async updateUser(updatedUser: UpdateUserDto): Promise<void> {
    if (updatedUser.password) {
      const passwordHash = await bcrypt.hash(updatedUser.password, saltRounds);
      updatedUser.password = passwordHash;
    }

    await this.usersRepository.updateUser(updatedUser);

    this.client.emit(
      'user_updated',
      `User with id: ${updatedUser.id} successfully updated`,
    );
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersRepository.deleteUser(id);
  }
}
