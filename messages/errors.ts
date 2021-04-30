import { HttpException } from '@nestjs/common';

export class customError extends HttpException {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}

export const customErrors = {
  CANT_FIND_USER_BY_ID: {
    code: 404,
    message: "Can't find user with such ID",
  },
  EMPTY_NEW_USER_DATA: {
    code: 400,
    message: 'New user data is empty',
  },
  EMPTY_USER_DATA_FOR_UPDATE: {
    code: 400,
    message: 'User data for updating is empty',
  },
  EMPTY_EMAIL_PASS_DATA: {
    code: 400,
    message: 'User data with email and password is empty',
  },
  EMAIL_OR_PHONE_ALREADY_IN_USE: {
    code: 400,
    message: "The user's email or phone number is already in use!",
  },
  EMAIL_IS_INCORRECT: {
    code: 401,
    message: 'The entered email is incorrect',
  },
  PASSWORD_IS_INCORRECT: {
    code: 401,
    message: 'The entered password is incorrect',
  },
  UNAUTHORISED: {
    code: 401,
    message: 'UNAUTHORISED!',
  },
};
