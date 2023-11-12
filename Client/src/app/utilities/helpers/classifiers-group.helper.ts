import { CategoryModel } from 'src/app/features/shared/models/category.model';
import { ClassifierModel } from 'src/app/features/shared/models/classifier.model';
import { GroupByItem } from 'src/app/features/shared/models/group-by-item.model';
import { Guid } from '../types/guid';

export class ClassifiersGroupHelper {
  public static group(categories: CategoryModel[]) {
    return categories.reduce((acc: GroupByItem<Guid, ClassifierModel, CategoryModel>[], cur: CategoryModel) => {
      let item = acc.find(e => e.key === cur.classifier.id);

      if(item){
        item.values.push(cur);
        return acc;
      }

      acc.push({
        key: cur.classifier.id,
        keyItem: cur.classifier,
        values: [cur]
      });

      return acc;
    }, []);
  }
}