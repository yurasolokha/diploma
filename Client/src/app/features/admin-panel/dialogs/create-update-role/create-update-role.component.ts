import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SimpleFormDialog } from 'src/app/features/shared/dialog-models/simple-form.dialog';
import { RoleModel } from 'src/app/features/shared/models/role.model';
import { Guid } from 'src/app/utilities/types/guid';

@Component({
  templateUrl: './create-update-role.component.html',
  styleUrls: ['./create-update-role.component.scss']
})
export class CreateUpdateRoleComponent extends SimpleFormDialog implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) data: any, dialog: MatDialogRef<CreateUpdateRoleComponent>) {
    super( !data.role ? {
      isUpdate: false,
      headerCaption: 'Create New Role',
      initForm: () => this.initEmptyForm()
    } : {
      isUpdate: true,
      headerCaption: 'Update Role ' + data.role.name,
      initForm: () => this.initFormFrom(data.role)
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

  private initFormFrom(role: RoleModel){
    this.form = new FormGroup({
      id: new FormControl(role.id),
      name: new FormControl(role.name, [Validators.required]),
    });
  }
}
