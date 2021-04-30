import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async userLogin(email: string): Promise<User> {
    const userDB = await this.usersRepository.findUserByEmail(email);

    return userDB;
  }

  async readAllUsers(
    searchParams: any,
    sortParams: any,
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

  async createUser(newUser: CreateUserDto): Promise<any> {
    const maxUsersId = await this.usersRepository.findMaxUserId();
    newUser.id = maxUsersId + 1;

    const passwordHash = await bcrypt.hash(newUser.password, saltRounds);
    newUser.password = passwordHash;

    await this.usersRepository.saveNewUser(newUser);
  }

  async updateUser(updatedUser: UpdateUserDto): Promise<void> {
    await this.usersRepository.updateUser(updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersRepository.deleteUser(id);
  }
}
