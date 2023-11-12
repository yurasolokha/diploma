import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';
import { TransactionTableColumnModel } from '../../models/transaction-table-column.model';

@Injectable({ providedIn: 'root' })
export class SettingsService extends AbstractRestService {
  
  constructor(protected override http: HttpClient){ super(http); }

  public updateDisplayedTransactionColumns(columns: TransactionTableColumnModel[]) {
    return this.postItem(`settings/update-transaction-columns`, columns);
  }

  public getAllDisplayedColumns() {
    return this.get(`settings/all-displayed-columns`);
  }

  public getDisplayedColumns() {
    return this.get(`settings/displayed-columns`);
  }
}