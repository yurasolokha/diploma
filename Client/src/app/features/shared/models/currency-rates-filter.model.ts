import { Guid } from 'src/app/utilities/types/guid';
import { environment } from 'src/environments/environment';
import { ISort } from '../interfaces/sort.interface';
import { IPagination } from '../interfaces/pagination.interface';


export class CurrencyRatesFilter {
  from!: Date;
  to!: Date;
  firstCurrency?: Guid;
  secondCurrency?: Guid;
  smoothFilter!: boolean;

  constructor(){
    let now = new Date();
    let monthAgo = new Date();
    
    now.setHours(23);
    now.setMinutes(59);

    if (!environment.production) { 
      monthAgo.setFullYear(2015, 1);
    }

    this.from = monthAgo;
    this.to = now;
    this.firstCurrency = undefined;
    this.secondCurrency = undefined;
    this.smoothFilter = true;
  }
}

export class CurrencyPaginationModel extends CurrencyRatesFilter implements ISort, IPagination {

  constructor(
    public pageIndex: number = 0,
    public pageSize: number = 50,
    public includeCount: boolean = true,
    public sortOrder: string = 'date.desc',
  ) {
    super();
  }
  
}


export class SimpleCurrencyRatesFilter {
  firstCurrency!: Guid;
  secondCurrency!: Guid;
}