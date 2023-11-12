import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateUpdateDialogModel } from './create-update-dialog.model';

export class SimpleFormDialog {
  public form!: FormGroup;

  constructor(public readonly model: CreateUpdateDialogModel, protected readonly dialogRef: MatDialogRef<any>){ }

  save() {
    const model = this.getModel();

    if(!model) return;

    this.close(model);
  }

  close(data: any = undefined) {
    this.dialogRef.close(data);
  }

  protected map?: (form: FormGroup) => any = undefined;

  private getModel(): any {
    Object.keys(this.form.controls).forEach(key => { this.form.controls[key].markAsDirty() });

    this.form.updateValueAndValidity();

    if(this.form.invalid) return undefined;

    return this.map ? this.map(this.form) : this.form.value;
  }
}