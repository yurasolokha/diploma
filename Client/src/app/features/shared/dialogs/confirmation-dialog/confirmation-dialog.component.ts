import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogModel } from '../../dialog-models/confirmation-dialog.model';

@Component({
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly model: ConfirmationDialogModel) {}

  close(isConfirmed: boolean = false) {
    this.dialogRef.close(isConfirmed);
  }
}
