export class CreateUserDto {
  id?: number;
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly phone: number;
  password: string;
}
