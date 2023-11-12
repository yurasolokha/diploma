import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { ImportService } from '../../services/import.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationDialogModel } from 'src/app/features/shared/dialog-models/confirmation-dialog.model';
import { ConfirmationDialogComponent } from 'src/app/features/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@UntilDestroy()
@Component({
  selector: 'app-data-import-export',
  templateUrl: './data-import-export.component.html',
  styleUrls: ['./data-import-export.component.scss']
})
export class DataImportExportComponent implements OnInit {
  public isLoading: boolean = false;

  public abyCashDbExtensions = ['.acb'];

  public progress = 0.00;
  public mode?: ProgressBarMode = undefined;
  public statusText: string = 'Uploading database';

  constructor(private router: Router, private importService: ImportService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }
  
  goTo(link: string){
    this.router.navigateByUrl(link);
  }

  importAbyCash(file: any){
    this.displayMessage("Import from database file", "Kindly note that your data will be deleted permanently.", {
      name: "warning",
      color: "accent"
    })
    .afterClosed()
    .pipe(untilDestroyed(this))
    .subscribe(isConfirm => {
      if(!isConfirm) return;

      this.mode = 'determinate';
  
      this.importService.importFromOldDatabase(file).pipe(untilDestroyed(this)).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = event.loaded / event.total! * 1000;
            this.statusText = `Uploaded ${(event.loaded / 1024).toFixed(2)}/${(event.total! / 1024).toFixed(2)}kb`;
            
            if(event.loaded / event.total! > 0.99){
              this.mode = 'indeterminate';
              this.statusText = 'Importing database...';
            }
          }
          else if (event.type === HttpEventType.Response) {
            this.statusText = (event.body as any).message;
            this.displayMessage("Import result", (event.body as any).message);
          } 
        },
        error: (error) => {
          this.displayMessage("Import result", 'Error while importing database!');
          this.mode = undefined;
          this.progress = 0;
          console.log(error as any);
        },
        complete: () => {
          this.mode = undefined;
          this.progress = 0;
        }
      });

    });
  }

  displayMessage(header: string, description: string, icon?: any) {
    const dialogModel: ConfirmationDialogModel = {
      header: header,
      description: description,
      icon: icon
    };

    return this.dialog.open(ConfirmationDialogComponent, { width: "700px", data: dialogModel });
  }
}
