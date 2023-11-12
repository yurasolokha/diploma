import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { CurrencyRateModel } from "../../shared/models/currency-rate.model";
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, finalize } from "rxjs";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { CurrencyRatesService } from "../services/api/currency-rates.service";
import { CurrencyPaginationModel } from "../../shared/models/currency-rates-filter.model";

@UntilDestroy()
export class CurrencyRatesDataSource implements DataSource<CurrencyRateModel> {
  private dataSubject = new BehaviorSubject<CurrencyRateModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  private _sort: MatSort | null = null;
  private _paginator: MatPaginator | null = null;

  constructor(private currencyRateService: CurrencyRatesService) {}

  get data(): CurrencyRateModel[] {
    return this.dataSubject.value;
  }

  get sort(): MatSort | null {
    return this._sort;
  }

  set sort(sort: MatSort | null) {
    this._sort = sort;
  }

  get paginator(): MatPaginator | null {
    return this._paginator;
  }

  set paginator(paginator: MatPaginator | null) {
    this._paginator = paginator;
  }

  _updatePaginator(filteredDataLength: number): void {
    if (!this.paginator) return;

    this.paginator.length = filteredDataLength;
  }

  connect(collectionViewer: CollectionViewer): Observable<CurrencyRateModel[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  loadCurrencyRates(filter: CurrencyPaginationModel) {
    this.loadingSubject.next(true);
    
    this.currencyRateService
      .getCurrencyRates(filter)
      .pipe(finalize(() => this.loadingSubject.next(false)), untilDestroyed(this))
      .subscribe({
        next: (result: any) => {
          this.dataSubject.next(result.currencyRates);
          this._updatePaginator(result.totalCount);
          
        },
      });
  }
}
