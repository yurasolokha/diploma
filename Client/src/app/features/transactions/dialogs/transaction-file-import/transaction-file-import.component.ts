import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ImportService } from 'src/app/features/admin-panel/services/import.service';
import { ImportDialogModel } from 'src/app/features/shared/dialog-models/import-dialog.model';

@Component({
  templateUrl: './transaction-file-import.component.html',
  styleUrls: ['./transaction-file-import.component.scss']
})
export class TransactionFileImportComponent
  implements OnInit {
  public model!: ImportDialogModel;

  private excelFileExtension = ['.xls', '.xlsx'];

  constructor(private readonly importService: ImportService, protected readonly dialogRef: MatDialogRef<TransactionFileImportComponent>) { }

  ngOnInit(): void {
    this.model = {
      headerCaption: "Import Transactions",
      fileExtensions: this.excelFileExtension,
      uploadFile: (file: File) => this.uploadFile(file)
    }
  }

  uploadFile(file: File) {
    return this.importService.importTransactionsFromExcel(file);
  }

  close(isChanged: boolean) {
    this.dialogRef.close(isChanged);
  }

}
