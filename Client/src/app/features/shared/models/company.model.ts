import { Guid } from 'src/app/utilities/types/guid';

export class CompanyModel{
  public id: Guid | undefined;
  public name!: string;
}