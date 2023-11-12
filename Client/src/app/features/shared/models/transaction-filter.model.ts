import { environment } from 'src/environments/environment';
import { AccountModel } from './account.model';
import { CategoryModel } from './category.model';
import * as moment from 'moment';

export class TransactionFilterModel
{
  constructor(
    public from: Date = undefined as any,
    public to: Date = undefined as any,
    public comment: string = undefined as any,
    public allowedTypes: string[] = [],
    public categories: CategoryModel[] = [],
    public accounts: AccountModel[] = [],
  ){
    const now = to ?? new Date();
    const startOfMonth = moment(now.getTime()).startOf('month').toDate(); 

    if (!environment.production) { 
      startOfMonth.setFullYear(2015, 0, 1);
    }
    
    if(!this.from) this.from = startOfMonth;
    if(!this.to) this.to = now;
  }
}