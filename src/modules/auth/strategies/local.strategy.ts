import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { customError, customErrors } from 'messages/errors';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new customError(
        customErrors.PASSWORD_IS_INCORRECT.message,
        customErrors.PASSWORD_IS_INCORRECT.code,
      );
    }

    return user;
  }
}
