import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller('subscribers')
export class SubscribersController {
  @EventPattern('user_updated')
  async getNotifications(data: string) {
    console.log(data);
  }
}
