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

export class UsersRepository {
  readAllUsers() {
    jest.fn((IFilterParamsAdmin, ISortParams, limit: number, skip: number) => {
      return Promise.resolve(Array<IAdmin>());
    });
  }
}
