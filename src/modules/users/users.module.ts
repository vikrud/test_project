import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { CustomersService } from './customer.service';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersFactory } from './users.factory';
import { AdminsService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
    forwardRef(() => AuthModule),
    ClientsModule.register([
      {
        name: 'SUBSCRIBERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
          ],
          queue: process.env.RABBITMQ_QUEUE_NAME,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [CustomersService, AdminsService, UsersFactory],
  controllers: [UserController],
  exports: [CustomersService],
})
export class UsersModule {}
