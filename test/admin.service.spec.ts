import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/modules/users/users.module';
import { UsersRepository } from '../src/modules/users/users.repository';
import { AdminsService } from '../src/modules/users/admin.service';

describe('AdminsServise', () => {
  let adminsServise: AdminsService;

  interface IAdmin {
    name: string;
    surname: string;
    email: string;
    phone: number;
    password: string;
    role: 1;
  }

  interface IFilterParamsAdmin {
    email: string | null;
    name: string | null;
    surname: string | null;
    role: 1;
  }

  interface ISortParams {
    sortBy: string | null;
    orderBy: string | null;
  }

  const MockUsersRepository = {
    readAllUsers: jest.fn(
      (IFilterParamsAdmin, ISortParams, limit: number, skip: number) => {
        return Promise.resolve(Array<IAdmin>());
      },
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [
        AdminsService,
        {
          provide: 'SUBSCRIBERS_SERVICE',
          useValue: {},
        },
      ],
    })
      .overrideProvider(UsersRepository)
      .useValue(MockUsersRepository)
      .compile();

    adminsServise = module.get<AdminsService>(AdminsService);
  });

  it('should be defined', () => {
    expect(adminsServise).toBeDefined();
  });

  it('should return an array with all users', async () => {
    const filterParams = {
      email: null,
      name: null,
      surname: null,
      role: 1,
    };
    const sortParams = {
      sortBy: null,
      orderBy: null,
    };
    const limit = 0;
    const skip = 0;

    const result = Array<IAdmin>();

    expect(
      await adminsServise.readAllUsers(filterParams, sortParams, limit, skip),
    ).toEqual(result);
  });

  it('should be called with the required params', () => {
    const filterParams = {
      email: null,
      name: null,
      surname: null,
      role: 1,
    };
    const sortParams = {
      sortBy: null,
      orderBy: null,
    };
    const limit = 0;
    const skip = 0;
    const sreadAllUsersSpy = jest
      .spyOn(MockUsersRepository, 'readAllUsers')
      .mockImplementation();

    expect(sreadAllUsersSpy).toBeCalledWith(
      filterParams,
      sortParams,
      limit,
      skip,
    );
  });
});
