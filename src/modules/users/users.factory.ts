import { Injectable } from '@nestjs/common';
import { AdminsService } from './admin.service';
import { CustomersService } from './customer.service';
import { RoleEnum } from './enums/role.enum';
import { IUserService } from './interfaces/user.service.interface';

@Injectable()
export class UsersFactory {
  constructor(
    private readonly customersService: CustomersService,
    private readonly adminsService: AdminsService,
  ) {}

  async getService(role: RoleEnum = RoleEnum.customer): Promise<IUserService> {
    if (role === RoleEnum.admin) {
      return this.adminsService;
    }

    return this.customersService;
  }
}
