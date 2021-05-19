import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  Query,
  UseFilters,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { AllExceptionsFilter } from './exceptions/all-exception-filter';
import { User } from './entities/user.entity';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { CustomMessage, customMessages } from '../../../messages/messages';
import { CreateUserDto, QueryParamsDto, UpdateUserDto } from './dto/user.dto';
import { UsersFactory } from './users.factory';

@Controller('v1/user')
@UseFilters(new AllExceptionsFilter())
@UseInterceptors(new TransformInterceptor())
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersFactory: UsersFactory,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query() queryParamsDto: QueryParamsDto,
    @Request() req,
  ): Promise<User[]> {
    const filterParams = {
      email: null,
      name: null,
      surname: null,
      role: null,
    };
    if (queryParamsDto.emailSearch) {
      filterParams.email = queryParamsDto.emailSearch;
    }
    if (queryParamsDto.userName) {
      const arr = queryParamsDto.userName.split(' ');
      filterParams.name = arr.shift();
      filterParams.surname = arr.pop();
    }

    const sortParams = {
      sortBy: null,
      orderBy: null,
    };
    if (queryParamsDto.sortBy) {
      sortParams.sortBy = queryParamsDto.sortBy;
      sortParams.orderBy = queryParamsDto.orderBy === 'desc' ? 'desc' : 'asc';
    }

    const limit = queryParamsDto.limit || 0;
    const skip = queryParamsDto.skip || 0;

    const userService = await this.usersFactory.getService(req.user.roleId);
    return userService.readAllUsers(filterParams, sortParams, limit, skip);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<User[]> {
    const userService = await this.usersFactory.getService(req.user.roleId);
    return userService.readOneUser(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<CustomMessage> {
    const userService = await this.usersFactory.getService();
    userService.createUser(createUserDto);

    return new CustomMessage(customMessages.USER_CREATED_MESSAGE);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<CustomMessage> {
    updateUserDto.id = id;

    const userService = await this.usersFactory.getService(req.user.roleId);
    await userService.updateUser(updateUserDto);

    return new CustomMessage(customMessages.USER_UPDATED_MESSAGE);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<CustomMessage> {
    const userService = await this.usersFactory.getService(req.user.roleId);
    await userService.deleteUser(id);

    return new CustomMessage(customMessages.USER_DELETED_MESSAGE);
  }
}
