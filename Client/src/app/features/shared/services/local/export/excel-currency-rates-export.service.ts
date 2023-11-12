import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DataConvention } from 'src/app/core/contracts/data.convention';
import { CustomNumberConverter } from 'src/app/utilities/converter/custom-number.converter';
import { CurrencyRateModel } from '../../../models/currency-rate.model';
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ExcelCurrencyRatesExportService{
  readonly  EXCEL_TYPE!: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  readonly  EXCEL_EXTENSION = '.xlsx';

  public exportToExcel(items: CurrencyRateModel[]) {
    let fileName = (new Date()).toISOString();
    let rows = items.map(e => this.transform(e));
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private transform(rate: CurrencyRateModel){
    return{
      'Date': moment(rate.date).format(DataConvention.DateFormat),
      'First Currency': rate.firstCurrency.code,
      'Second Currency': rate.secondCurrency.code,
      'Rate': CustomNumberConverter.Round(rate.rate, DataConvention.ExtendedPrecision)
    }
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: this.EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + this.EXCEL_EXTENSION);
  }
}