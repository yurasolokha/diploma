import { Guid } from 'src/app/utilities/types/guid';

export class AccessModel {
  id!: Guid;
  path!: string;
  name!: string;
  accesses!: any;
}

export class UserAccess {
  userId!: string;
  accessLevel!: AccessLevel;
}

export class ApiAccessModel {
  id!: Guid;
  path!: string;
  name!: string;
  accesses!: UserAccess[];
}

export class UpdateAccessModel {
  accessId!: Guid;
  userId!: Guid;
  accessLevel!: AccessLevel;
}

export enum AccessLevel {
  Restricted = 0,
  Full = 1,
}
