import {
  CacheInterceptor,
  CacheModule,
  forwardRef,
  Module,
} from '@nestjs/common';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
    forwardRef(() => AuthModule),
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: 86400,
      }),
    }),
  ],
  providers: [
    UsersService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
