import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CustomError, customErrors } from 'messages/errors';
import { IValidateLocalUser } from '../interfaces/auth.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<IValidateLocalUser> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new CustomError(
        customErrors.PASSWORD_IS_INCORRECT.message,
        customErrors.PASSWORD_IS_INCORRECT.code,
      );
    }

    return user;
  }
}
