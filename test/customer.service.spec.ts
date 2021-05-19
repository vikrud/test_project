import { CustomersService } from '../src/modules/users/customer.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/modules/users/users.module';
import { UsersRepository } from '../src/modules/users/users.repository';

describe('CustomersServise', () => {
  let customersServise: CustomersService;

  interface ICustomer {
    name: string;
    surname: string;
    email: string;
    phone: number;
    password: string;
    role: 2;
  }

  interface IFilterParamsCustomer {
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
      (IFilterParamsCustomer, ISortParams, limit: number, skip: number) => {
        return Promise.resolve(Array<ICustomer>());
      },
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [
        CustomersService,
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

  it('should be defined', () => {
    expect(customersServise).toBeDefined();
  });

  it('should return an array with only all customers', async () => {
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

    const result = Array<ICustomer>();

    expect(
      await customersServise.readAllUsers(
        filterParams,
        sortParams,
        limit,
        skip,
      ),
    ).toEqual(result);
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
