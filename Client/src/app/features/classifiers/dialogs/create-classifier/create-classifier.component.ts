import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogModel } from 'src/app/features/shared/dialog-models/confirmation-dialog.model';
import { SimpleFormDialog } from 'src/app/features/shared/dialog-models/simple-form.dialog';
import { ConfirmationDialogComponent } from 'src/app/features/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ClassifierModel } from 'src/app/features/shared/models/classifier.model';
import { TransactionsService } from 'src/app/features/transactions/services/api/transactions.service';
import { Guid } from 'src/app/utilities/types/guid';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-create-classifier',
  templateUrl: './create-classifier.component.html',
  styleUrls: ['./create-classifier.component.scss']
})
export class CreateClassifierComponent  extends SimpleFormDialog implements OnInit {
  public transactionTypes!: string[];
  
  constructor(
    private transactionsService: TransactionsService,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any, 
    dialog: MatDialogRef<CreateClassifierComponent>) {
    super( !data.classifier ? {
      isUpdate: false,
      headerCaption: 'Create New Classifier',
      initForm: () => this.initEmptyForm()
    } : {
      isUpdate: true,
      headerCaption: 'Update Classifier ' + data.classifier.singularName,
      initForm: () => this.initFormFrom(data.classifier)
    }, dialog);
  }

  ngOnInit(): void {
    this.model.initForm();
    this.loadTransactionTypes();
  }

  InputValidation(formControlName: string): boolean {
    const inputValue = this.form.controls[formControlName];

    return (inputValue.invalid && inputValue.dirty);
  }

  displayError(header: string, description: string){
    const dialogModel: ConfirmationDialogModel = {
      header: header,
      description: description,
    };
    
    this.matDialog.open(ConfirmationDialogComponent, { data: dialogModel }) 
  }

  private loadTransactionTypes(): void{
    this.transactionsService.getTransactionTypes().pipe(untilDestroyed(this)).subscribe((types: any) =>{
      this.transactionTypes = types;
    },
    error =>{
      console.error(error);

      this.displayError('Failed to load transaction types', error.message);
    });
  }
  
  private initEmptyForm(){
    this.form = new FormGroup({
      id: new FormControl(Guid.newGuid()),
      pluralName: new FormControl(undefined, [Validators.required]),
      singularName: new FormControl(undefined, [Validators.required]),
      requiredTransactionTypes: new FormControl([]),
    });
  }

  private initFormFrom(classifier: ClassifierModel){
    this.form = new FormGroup({
      id: new FormControl(classifier.id),
      pluralName: new FormControl(classifier.pluralName, [Validators.required]),
      singularName: new FormControl(classifier.singularName, [Validators.required]),
      requiredTransactionTypes: new FormControl(classifier.requiredTransactionTypes),
    });
  }
}
