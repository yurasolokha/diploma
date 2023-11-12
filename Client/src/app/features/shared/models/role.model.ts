import { Guid } from 'src/app/utilities/types/guid';

export class RoleModel {
  public id: Guid | undefined;
  public name!: string;
}