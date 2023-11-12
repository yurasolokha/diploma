import { FormControl } from '@angular/forms';
import { CategoryModel } from 'src/app/features/shared/models/category.model';
import { ClassifierControl } from 'src/app/features/shared/models/classifier-contols.model';
import { ClassifierModel } from 'src/app/features/shared/models/classifier.model';
import { GroupByItem } from 'src/app/features/shared/models/group-by-item.model';
import { Guid } from '../types/guid';

export class ClassifiersControlsHelper {
  public static getControls(classifiers: ClassifierModel[]): ClassifierControl[] {
    return classifiers
      .sort((e1, e2) => e1.orderWeight - e2.orderWeight)
      .reduce((acc, cur) => {
        acc.push(new ClassifierControl(cur, cur.pluralName, new FormControl(undefined)));
        return acc;
      }, [] as ClassifierControl[]);
  }
}