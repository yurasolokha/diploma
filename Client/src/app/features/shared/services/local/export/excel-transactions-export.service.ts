import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { TransactionModel } from '../../../models/transaction.model';
import { TransactionTableColumnModel } from '../../../models/transaction-table-column.model';
import { CustomNumberConverter } from 'src/app/utilities/converter/custom-number.converter';
import { DataConvention } from 'src/app/core/contracts/data.convention';

@Injectable({ providedIn: 'root' })
export class ExcelTransactionsExportService {
  readonly  EXCEL_TYPE!: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  readonly  EXCEL_EXTENSION = '.xlsx';

  public exportToExcel(transactions: TransactionModel[], displayedColumns: TransactionTableColumnModel[]){
    let fileName = (new Date()).toISOString();
    let rows = transactions.map(e => this.getRow(e, displayedColumns));
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private getRow(transaction: TransactionModel, displayedColumns: TransactionTableColumnModel[]){
    let result: any = {};
    displayedColumns.forEach(col => {
      if(col.columnType === 'property') result[col.columnName] = this.getValue(transaction, col.propertyName);
      else if(col.columnType === 'classifier') result[col.columnName] = transaction.categories.find(c => c.classifier.id === col.propertyName)?.name ?? '';
    });
    return result;
  }

  private getValue(transaction: any, propertyName: any): any{
    if(propertyName === 'company') return transaction.user.company.name;
    if(propertyName === 'user') return transaction.user.userName;
    if(propertyName === 'date') return moment(transaction[propertyName]).format(DataConvention.DateTimeExtendedFormat);

    let property = transaction[propertyName];
    if(property?.currency?.code && property.name) return `${property.currency.code} - ${property.name}`;
    if(property?.company?.name && property.name) return property.name;

    let type = typeof property;
    if(type === 'boolean') return property ? '+' : '';
    if(type === 'string') return property;
    if(type === 'number') return CustomNumberConverter.Round(property, DataConvention.DefaultPrecision);

    return property;
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: this.EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + this.EXCEL_EXTENSION);
  }
}