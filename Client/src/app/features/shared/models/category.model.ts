import { Guid } from 'src/app/utilities/types/guid';
import { ClassifierModel } from './classifier.model';

export class CategoryModel{
  id!: Guid;
  name!: string;
  path!: string;
  description!: string;
  types!: string[];
  classifier!: ClassifierModel;
}