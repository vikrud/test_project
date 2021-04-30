export class UpdateUserDto {
  id?: number;
  readonly name?: string;
  readonly surname?: string;
  readonly email?: string;
  readonly phone?: number;
  readonly password?: string;
}
