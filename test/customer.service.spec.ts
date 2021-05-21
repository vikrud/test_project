import { CustomersService } from '../src/modules/users/customer.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/modules/users/users.module';
import { UsersRepository } from '../src/modules/users/users.repository';
//jest.mock('../src/modules/users/users.repository');

describe('CustomersServise', () => {
  let customersServise: CustomersService;

  interface IUserForCustomer {
    name: string;
    surname: string;
    email: string;
    phone: number;
    password: string;
    role: 2;
  }

  interface IFilterParamsAdmin {
    email: string | null;
    name: string | null;
    surname: string | null;
    role: 2;
  }

  interface ISortParams {
    sortBy: string | null;
    orderBy: string | null;
  }

  const MockUsersRepository = {
    readAllUsers: jest.fn(
      (IFilterParamsAdmin, ISortParams, limit: number, skip: number) => {
        return Promise.resolve(result);
      },
    ),
  };

  const result = [
    {
      id: 1,
      name: 'Tom',
      surname: 'Petrenko',
      email: 'petrenko.t@mail.com',
      phone: '380951234567',
      password: '$2b$10$QibZHySF5vAOvLNpLtByAea0Zolhk.1dKT5vsP6OIS4i/9Pqijybi',
      roleId: 2,
    },
    {
      id: 2,
      name: 'Viktor',
      surname: 'Rudenko',
      email: 'rudenko.v@mail.com',
      phone: '380631234567',
      password: '$2b$10$clJ.1u7OXHganrBYPaTDIOpUW8Nljzx1.TcDThMoiqo61i9yOiJ6W',
      roleId: 2,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [
        CustomersService,
        // {
        //   provide: getRepositoryToken(User),
        //   useValue: MockUsersRepository,
        // },
        {
          provide: 'SUBSCRIBERS_SERVICE',
          useValue: {},
        },
      ],
    })
      .overrideProvider(UsersRepository)
      .useValue(MockUsersRepository)
      .compile();

    customersServise = module.get<CustomersService>(CustomersService);
  });

  it('should return an array with all users', async () => {
    const filterParams = {
      email: null,
      name: null,
      surname: null,
      role: 2,
    };
    const sortParams = {
      sortBy: null,
      orderBy: null,
    };
    const limit = 0;
    const skip = 0;

    const readAllUsersSpy = jest.spyOn(MockUsersRepository, 'readAllUsers');

    expect(
      await customersServise.readAllUsers(
        filterParams,
        sortParams,
        limit,
        skip,
      ),
    ).toEqual(result);

    expect(readAllUsersSpy).toHaveBeenCalledWith(
      filterParams,
      sortParams,
      limit,
      skip,
    );
  });

  it('should be called with the required params', () => {
    const filterParams = {
      email: null,
      name: null,
      surname: null,
      role: 2,
    };
    const sortParams = {
      sortBy: null,
      orderBy: null,
    };
    const limit = 0;
    const skip = 0;

    const readAllUsersSpy = jest.spyOn(MockUsersRepository, 'readAllUsers');

    expect(readAllUsersSpy).toBeCalledWith(
      filterParams,
      sortParams,
      limit,
      skip,
    );
  });
});
