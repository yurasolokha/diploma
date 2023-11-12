import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { ImportDialogModel } from '../../dialog-models/import-dialog.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HttpEventType } from '@angular/common/http';
import { ConfirmationDialogModel } from '../../dialog-models/confirmation-dialog.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@UntilDestroy()
@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent {
  @Input('model') model!: ImportDialogModel;

  @Output('close') close: EventEmitter<boolean> = new EventEmitter<boolean>();

  public selectedFile?: File;
  public progress = 0.00;
  public mode?: ProgressBarMode = undefined;
  public statusText: string = 'Uploading file';

  constructor(private dialog: MatDialog) { }

  fileChange(file: File){
    this.selectedFile = file;
  }

  confirm() {
    if(!this.selectedFile) {
      this.close.emit(false);
      return;
    }
    this.mode = 'determinate';

    this.model.uploadFile(this.selectedFile).pipe(untilDestroyed(this)).subscribe( {
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = event.loaded / event.total! * 1000;
          this.statusText = `  ${(event.loaded / 1024).toFixed(2)}/${(event.total! / 1024).toFixed(2)}kb`;
          
          if(event.loaded / event.total! > 0.99){
            this.mode = 'indeterminate';
            this.statusText = 'Uploading file...';
          }
        }
        else if (event.type === HttpEventType.Response) {
          if((event.body as any).isSuccess){
            this.displayDialog("Import State Info", (event.body as any).message)
            this.close.emit(true);
            return;
          }
          this.displayDialog("Error while importing", (event.body as any).message);
        };
      },
      error: (error) => {
        this.displayDialog("Import result", 'Error while uploading file!');
        console.log(error);
      },
      complete: () => {
        this.statusText = '';
        this.mode = undefined;
        this.progress = 0;
      }
    }
    );
  }

  cancel() {
    this.close.emit(false);
  }

  displayDialog(header: string, description: string) {
    const dialogModel: ConfirmationDialogModel = {
      header: header,
      description: description,
    };

    this.dialog.open(ConfirmationDialogComponent, { width: "700px", data: dialogModel });
  }

}
