import { Guid } from 'src/app/utilities/types/guid';
import { CompanyModel } from '../../shared/models/company.model';
import { RoleModel } from '../../shared/models/role.model';

export class NewUserModel{
  id!: Guid;
  name!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  middleName!: string;
  password!: string;
  repeatPassword!: string;
  company!: CompanyModel;
  roles!: RoleModel[];
}