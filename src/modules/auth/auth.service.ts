import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ILoginJWT, IValidateLocalUser } from './interfaces/auth.interface';
import { UsersFactory } from '../users/users.factory';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersFactory: UsersFactory,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<IValidateLocalUser | null> {
    const userService = await this.usersFactory.getService();
    const user = await userService.userLogin(email);
    const hashPass = await bcrypt.compare(pass, user.password);

    if (user && hashPass) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: IValidateLocalUser): Promise<ILoginJWT> {
    const payload = { id: user.id, email: user.email, roleId: user.roleId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
