import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TransactionFilterModel } from '../../shared/models/transaction-filter.model';
import { Guid } from 'src/app/utilities/types/guid';

@Injectable({ providedIn: 'root' })
export class ImportService {
  private path: string = "import";
  private api: string = environment.api_url;

  constructor(private http: HttpClient){}

  public importFromOldDatabase(file: File){
    const formData = new FormData();
    formData.append('database', file, file.name);
    return this.http.post(`${this.api}/${this.path}/import-database`, formData, { reportProgress: true, observe: 'events' });
  }

  public importTransactionsFromExcel(file: File){
    const formData = new FormData();
    formData.append('transactionsExcel', file, file.name);
    return this.http.post(`${this.api}/${this.path}/import-transactions`, formData, { reportProgress: true, observe: 'events' });
  }

  public exportFiltredTransactionsToExcel(filter: TransactionFilterModel){
    return this.http.post(`${this.api}/${this.path}/export-transactions`, filter,  {responseType: 'blob'});
  }

  public exportTransactionsByIdsToExcel(ids: Guid[]){
    return this.http.post(`${this.api}/${this.path}/export-transactions/ids`, ids,  {responseType: 'blob'});
  }
}
