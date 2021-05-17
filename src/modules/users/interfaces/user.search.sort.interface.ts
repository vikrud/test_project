import { RoleEnum } from '../enums/role.enum';

export interface IFilterParams {
  email: string | null;
  name: string | null;
  surname: string | null;
  role: RoleEnum | null;
}

export interface ISortParams {
  sortBy: string | null;
  orderBy: string | null;
}
