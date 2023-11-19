import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SimpleFormDialog } from 'src/app/features/shared/dialog-models/simple-form.dialog';
import { CategoryModel } from 'src/app/features/shared/models/category.model';
import { Guid } from 'src/app/utilities/types/guid';
import {AccessesService} from "../../../admin-panel/services/accesses.service";
import {UserAccessModel} from "../../../shared/models/user-access.model";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@Component({
  templateUrl: './create-update-category.component.html',
  styleUrls: ['./create-update-category.component.scss']
})
@UntilDestroy()
export class CreateUpdateCategoryComponent extends SimpleFormDialog implements OnInit {
  public isRoot;
  public categoryTypes;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, dialog: MatDialogRef<CreateUpdateCategoryComponent>,
              private accessesService: AccessesService) {
    super( !data.category ? {
      isUpdate: false,
      headerCaption: 'Create New Category',
      initForm: () => this.initEmptyForm()
    } : {
      isUpdate: true,
      headerCaption: 'Update Category ' + data.category.name,
      initForm: () => this.initFormFrom(data.category)
    }, dialog);

    this.isRoot = !!this.data.folderData.path.match(/^\/?$/) && !data.category;
    this.categoryTypes = data.categoryTypes;
  }

  userDefaultAssesses: UserAccessModel[] = [];

  ngOnInit(): void {
    if(this.model.isUpdate){
      this.model.initForm();
    }
    else {
      this.accessesService.getUserDefaultAccesses().pipe(untilDestroyed(this)).subscribe(res => {
        this.userDefaultAssesses = res;
        this.model.initForm();
      });
    }
  }

  InputValidation(formControlName: string): boolean {
    const inputValue = this.form.controls[formControlName];

    return (inputValue.invalid && inputValue.dirty);
  }

  protected override map = ((form: FormGroup) => {
    const formValue = form.getRawValue();
    const value = {
      id: formValue.id,
      name: formValue.name,
      classifier: this.data.classifier,
      types: formValue.selectedTypes,
      path:  formValue.path,
      description: formValue.description
    }
    if(this.model.isUpdate){
      return value;
    }
    else {
      return {
        ...value,
        userAccesses: formValue.userAccesses
      }
    }

  });

  private initEmptyForm() {
    this.form = new FormGroup({
      id: new FormControl(Guid.newGuid()),
      name: new FormControl(undefined, [Validators.required]),
      path: new FormControl(this.data.folderData.path ?? '/', [Validators.required]),
      description: new FormControl(undefined),
      selectedTypes: new FormControl({value: this.isRoot ? undefined : this.data.parent.types, disabled: !this.isRoot}, [Validators.required]),
      userAccesses: new FormControl(this.userDefaultAssesses)
    });
  }

  private initFormFrom(category: CategoryModel) {
    this.form = new FormGroup({
      id: new FormControl(category.id),
      name: new FormControl(category.name, [Validators.required]),
      path: new FormControl(category.path === '' ? '/' : category.path, [Validators.required]),
      description: new FormControl(category.description),
      selectedTypes: new FormControl({value: category.types, disabled: !this.isRoot}, [Validators.required]),
    });
  }
}
