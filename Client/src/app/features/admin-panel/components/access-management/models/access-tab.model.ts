import { BehaviorSubject } from 'rxjs';
import {
    AccessModel,
    UpdateAccessModel,
} from '../../../models/access.model';
import { Column } from '../components/access-table/models/column.model';
import { UserModel } from 'src/app/features/shared/models/user.model';

export interface AccessTab {
  index: number;
  label: string;
  frozenColumns: Column[];
  users: BehaviorSubject<UserModel[]>;
  data: BehaviorSubject<AccessModel[]>;
  loadFunction: (dataContext: BehaviorSubject<AccessModel[]>) => void;
  updateHandler: (data: UpdateAccessModel[]) => void;
}
