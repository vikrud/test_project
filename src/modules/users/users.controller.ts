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
import { AllExceptionsFilter } from 'src/modules/users/exceptions/all-exception-filter';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransformInterceptor } from 'src/modules/users/interceptors/transform.interceptor';
import { CustomMessage, customMessages } from 'messages/messages';
import { CreateUserDto, QueryParamsDto, UpdateUserDto } from './dto/user.dto';

@Controller('v1/user')
@UseFilters(new AllExceptionsFilter())
@UseInterceptors(new TransformInterceptor())
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Query() queryParamsDto: QueryParamsDto): Promise<User[]> {
    const searchParams = {
      email: null,
      name: null,
      surname: null,
    };
    if (queryParamsDto.emailSearch) {
      searchParams.email = queryParamsDto.emailSearch;
    }
    if (queryParamsDto.userName) {
      const arr = queryParamsDto.userName.split(' ');
      searchParams.name = arr.shift();
      searchParams.surname = arr.pop();
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

    return this.usersService.readAllUsers(
      searchParams,
      sortParams,
      limit,
      skip,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<User[]> {
    return this.usersService.readOneUser(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<CustomMessage> {
    await this.usersService.createUser(createUserDto);

    return new CustomMessage(customMessages.USER_CREATED_MESSAGE);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomMessage> {
    updateUserDto.id = id;

    await this.usersService.updateUser(updateUserDto);

    return new CustomMessage(customMessages.USER_UPDATED_MESSAGE);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<CustomMessage> {
    await this.usersService.deleteUser(id);

    return new CustomMessage(customMessages.USER_DELETED_MESSAGE);
  }
}
