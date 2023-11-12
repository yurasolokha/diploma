import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountsBalanceReportRequest } from 'src/app/features/shared/models/reports/accounts-balance-report-request.model';
import { CurrencyRateReportRequest } from 'src/app/features/shared/models/reports/currency-rate-report-request.model';
import { TurnoverRateReportRequestModel } from 'src/app/features/shared/models/reports/turnover-rate-report-request.model';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';

@Injectable({ providedIn: 'root' })
export class ReportsService extends AbstractRestService {

  constructor(protected override http: HttpClient){ super(http); }

  public getCurrencyRateReport(request: CurrencyRateReportRequest) {
    return this.postItem(`reports/currency-rate-report`, request);
  }

  public getTurnoverRateReport(request: TurnoverRateReportRequestModel) {
    return this.postItem(`reports/turnover-rate-report`, request);
  }

  public getAccountsBalanceReport(request: AccountsBalanceReportRequest) {
    return this.postItem(`reports/accounts-balance-report`, request);
  }
}
