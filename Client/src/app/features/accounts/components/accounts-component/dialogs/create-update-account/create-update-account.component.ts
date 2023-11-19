import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {selectCurrenciesFeature} from 'src/app/core/store/currency/currency.selectors';
import {SimpleFormDialog} from 'src/app/features/shared/dialog-models/simple-form.dialog';
import {AccountModel} from 'src/app/features/shared/models/account.model';
import {CurrencyHelper} from 'src/app/utilities/helpers/currency-store.helper';
import {Guid} from 'src/app/utilities/types/guid';
import {AccessesService} from "../../../../../admin-panel/services/accesses.service";
import {UserAccessModel} from "../../../../../shared/models/user-access.model";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@Component({
  templateUrl: './create-update-account.component.html',
  styleUrls: ['./create-update-account.component.scss']
})
@UntilDestroy()
export class CreateUpdateAccountComponent  extends SimpleFormDialog implements OnInit {
  public currencies$ = this.store.pipe(select(selectCurrenciesFeature));

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, dialog: MatDialogRef<CreateUpdateAccountComponent>, public store: Store, private  accessesService: AccessesService) {
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

  userDefaultAssesses: UserAccessModel[] = [];

  ngOnInit(): void {
    if(this.model.isUpdate){
      this.model.initForm();
    }
    else{
      this.accessesService.getUserDefaultAccesses().pipe(untilDestroyed(this)).subscribe(res => {
        this.userDefaultAssesses = res;
        this.model.initForm();
      });
    }
  }

  protected override map = ((form: FormGroup) => {
    let value = {
      ...form.getRawValue(),
      balance: undefined,
      recalculatedBalance: undefined,
    }
    if(this.model.isUpdate){
      value = {
        ...value,
        userAccesses: value.userAccesses.map((x :  UserAccessModel)=>{
          return {
            userId: x.userId,
            accessLevel: x.accessLevel
          }
        })
      }
    }
    return value;
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
      userAccesses: new FormControl(this.userDefaultAssesses)
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
