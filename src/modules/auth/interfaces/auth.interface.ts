import { RoleEnum } from 'src/modules/users/enums/role.enum';

export interface ILoginJWT {
  access_token: string;
}

export interface IValidateLocalUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: number;
  roleId: RoleEnum;
}

export interface IPayload {
  id: number;
  email: string;
  roleId: RoleEnum;
  iat: number;
  exp: number;
}

export interface IValidateJWTUser {
  id: number;
  email: string;
  roleId: RoleEnum;
}
