import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { IFilterParams, ISortParams } from './user.search.sort.interface';

export interface IUserService {
  userLogin(email: string): Promise<User>;

  readAllUsers(
    filterParams: IFilterParams,
    sortParams: ISortParams,
    limit: number,
    skip: number,
  ): Promise<User[]>;

  readOneUser(id: number): Promise<User[]>;

  createUser(newUser: CreateUserDto): Promise<void>;

  updateUser(updatedUser: UpdateUserDto): Promise<void>;

  deleteUser(id: number): Promise<void>;
}
