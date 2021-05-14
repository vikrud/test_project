import { Injectable } from '@nestjs/common';
import { CustomersService } from '../users/customer.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ILoginJWT, IValidateLocalUser } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private customersService: CustomersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<IValidateLocalUser | null> {
    const user = await this.customersService.userLogin(email);
    const hashPass = await bcrypt.compare(pass, user.password);

    if (user && hashPass) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: IValidateLocalUser): Promise<ILoginJWT> {
    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
