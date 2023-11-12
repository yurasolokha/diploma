import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SimpleFormDialog } from 'src/app/features/shared/dialog-models/simple-form.dialog';
import { CurrencyModel } from 'src/app/features/shared/models/currency.model';
import { Guid } from 'src/app/utilities/types/guid';

@Component({
  templateUrl: './create-update-currency.component.html',
  styleUrls: ['./create-update-currency.component.scss']
})
export class CreateUpdateCurrencyComponent extends SimpleFormDialog implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) data: any, dialog: MatDialogRef<CreateUpdateCurrencyComponent>) {
    super( !data.currency ? {
      isUpdate: false,
      headerCaption: 'Add New Currency',
      initForm: () => this.initEmptyForm()
    } : {
      isUpdate: true,
      headerCaption: 'Update Currency ' + data.currency.code,
      initForm: () => this.initFormFrom(data.currency)
    }, dialog);
  }

  ngOnInit(): void {
    this.model.initForm();
  }

  InputValidation(formControlName: string): boolean {
    const inputValue = this.form.controls[formControlName];

    return (inputValue.invalid && inputValue.dirty);
  }

  private initEmptyForm() {
    this.form = new FormGroup({
      id: new FormControl(Guid.newGuid()),
      name: new FormControl(undefined, [Validators.required]),
      code: new FormControl(undefined, [Validators.required]),
    });
  }

  private initFormFrom(currency: CurrencyModel){
    this.form = new FormGroup({
      id: new FormControl(currency.id),
      name: new FormControl(currency.name, [Validators.required]),
      code: new FormControl(currency.code, [Validators.required]),
    });
  }
}
