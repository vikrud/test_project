export class LoginUserDto {
  readonly email: string;
  readonly password: string;
}

export class CreateUserDto {
  id?: number;
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly phone: number;
  password: string;
  readonly roleId: number;
}

export class UpdateUserDto {
  id?: number;
  readonly name?: string;
  readonly surname?: string;
  readonly email?: string;
  readonly phone?: number;
  password?: string;
  readonly roleId?: number;
}

export class QueryParamsDto {
  emailSearch?: string;
  userName?: string;
  sortBy?: string;
  orderBy?: string;
  limit?: number;
  skip?: number;
}
