import { Module } from '@nestjs/common';
import { SubscribersController } from './subscribers.controller';

@Module({
  controllers: [SubscribersController],
})
export class SubscribersModule {}
