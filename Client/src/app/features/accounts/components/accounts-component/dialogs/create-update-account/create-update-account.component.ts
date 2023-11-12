import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { selectCurrenciesFeature } from 'src/app/core/store/currency/currency.selectors';
import { SimpleFormDialog } from 'src/app/features/shared/dialog-models/simple-form.dialog';
import { AccountModel } from 'src/app/features/shared/models/account.model';
import { CurrencyHelper } from 'src/app/utilities/helpers/currency-store.helper';
import { Guid } from 'src/app/utilities/types/guid';

@Component({
  templateUrl: './create-update-account.component.html',
  styleUrls: ['./create-update-account.component.scss']
})
export class CreateUpdateAccountComponent  extends SimpleFormDialog implements OnInit {
  public currencies$ = this.store.pipe(select(selectCurrenciesFeature));

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, dialog: MatDialogRef<CreateUpdateAccountComponent>, public store: Store) {
    super( !data.account ? {
      isUpdate: false,
      headerCaption: 'Create New Account',
      initForm: () => this.initEmptyForm()
    } : {
      isUpdate: true,
      headerCaption: 'Update Account ' + data.account.name,
      initForm: () => this.initFormFrom(data.account)
    }, dialog);

  }

  ngOnInit(): void {
    this.model.initForm();
  }

  protected override map = ((form: FormGroup) => {
    const value = form.getRawValue();
    return {
      ...value,
      balance: undefined,
      recalculatedBalance: undefined,
    };
  });

  InputValidation(formControlName: string): boolean {
    const inputValue = this.form.controls[formControlName];

    return (inputValue.invalid && inputValue.dirty);
  }

  InputNumberValidation(formControlName: string): boolean {
    const inputValue = this.form.controls[formControlName];
    let isNumber = !isNaN(Number(inputValue.value));
    return (inputValue.invalid && inputValue.dirty) || !isNumber;
  }

  private initEmptyForm(){
    this.form = new FormGroup({
      id: new FormControl(Guid.newGuid()),
      name: new FormControl(undefined, [Validators.required]),
      path: new FormControl(this.data.folderData.path, [Validators.required]),
      description: new FormControl(undefined),
      startingBalance: new FormControl(0.0, [Validators.required]),
      currency: new FormControl(undefined, [Validators.required]),
    });
  }

  private initFormFrom(account: AccountModel){
    this.form = new FormGroup({
      id: new FormControl(account.id),
      name: new FormControl(account.name, [Validators.required]),
      path: new FormControl(account.path, [Validators.required]),
      description: new FormControl(account.description),
      startingBalance: new FormControl(account.startingBalance, [Validators.required]),
      currency: new FormControl(CurrencyHelper.findCurrency(this.currencies$, account.currency.id), [Validators.required]),
    });
  }
}