import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { saltRounds } from './constants';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import {
  ISearchParams,
  ISortParams,
} from './interfaces/user.search.sort.interface';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject('SUBSCRIBERS_SERVICE') private readonly client: ClientProxy,
  ) {}

  async userLogin(email: string): Promise<User> {
    const userDB = await this.usersRepository.findUserByEmail(email);

    return userDB;
  }

  async readAllUsers(
    searchParams: ISearchParams,
    sortParams: ISortParams,
    limit: number,
    skip: number,
  ): Promise<User[]> {
    const users = await this.usersRepository.readAllUsers(
      searchParams,
      sortParams,
      limit,
      skip,
    );

    return users;
  }

  async readOneUser(id: number): Promise<User[]> {
    const user = await this.usersRepository.readUserById(id);
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
