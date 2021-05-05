export class CustomMessage {
  message: string;
  constructor(message: string) {
    this.message = message;
  }
}

export const customMessages = {
  USER_CREATED_MESSAGE: 'New user created successfully!',

  USER_UPDATED_MESSAGE: 'User updated successfully!',

  USER_DELETED_MESSAGE: 'User deleted successfully!',
};
