import { Guid } from 'src/app/utilities/types/guid';
import { CompanyModel } from './company.model';
import { RoleModel } from './role.model';

export class UserModel {
  public id: Guid | undefined;
  public email!: string;
  public userName!: string;
  public firstName!: string;
  public middleName!: string;
  public lastName!: string;
  public roles!: RoleModel[];
  public company!: CompanyModel;
  public image: string | undefined; // base64 image
}