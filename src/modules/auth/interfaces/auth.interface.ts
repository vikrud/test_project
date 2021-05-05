export interface ILoginJWT {
  access_token: string;
}

export interface IValidateLocalUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: number;
}

export interface IPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

export interface IValidateJWTUser {
  id: number;
  email: string;
}
