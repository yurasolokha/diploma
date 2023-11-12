import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SimpleFormDialog } from 'src/app/features/shared/dialog-models/simple-form.dialog';
import { CompanyModel } from 'src/app/features/shared/models/company.model';
import { Guid } from 'src/app/utilities/types/guid';

@Component({
  templateUrl: './create-update-company.component.html',
  styleUrls: ['./create-update-company.component.scss']
})
export class CreateUpdateCompanyComponent extends SimpleFormDialog implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) data: any, dialog: MatDialogRef<CreateUpdateCompanyComponent>) {
    super( !data.company ? {
      isUpdate: false,
      headerCaption: 'Create New Company',
      initForm: () => this.initEmptyForm()
    } : {
      isUpdate: true,
      headerCaption: 'Update Company ' + data.company.name,
      initForm: () => this.initFormFrom(data.company)
    }, dialog);
  }

  ngOnInit(): void {
    this.model.initForm();
  }

  InputValidation(formControlName: string): boolean {
    const inputValue = this.form.controls[formControlName];

    return (inputValue.invalid && inputValue.dirty);
  }

  private initEmptyForm(){
    this.form = new FormGroup({
      id: new FormControl(Guid.newGuid()),
      name: new FormControl(undefined, [Validators.required]),
    });
  }

  private initFormFrom(company: CompanyModel){
    this.form = new FormGroup({
      id: new FormControl(company.id),
      name: new FormControl(company.name, [Validators.required]),
    });
  }
}