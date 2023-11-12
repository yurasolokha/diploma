import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassifiersService } from 'src/app/features/classifiers/services/api/classifiers.service';
import { BlockedDateModel } from 'src/app/features/shared/models/blocked-date.model';
import { ClassifierModel } from 'src/app/features/shared/models/classifier.model';
import { BlockedDatesService } from 'src/app/features/shared/services/api/blocked-dates.service';
import { TransactionsService } from 'src/app/features/transactions/services/api/transactions.service';
import { Guid } from 'src/app/utilities/types/guid';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';

@UntilDestroy()
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  public isLoading: boolean = false;
  public goTo(link: string){ this.router.navigateByUrl(link); }

  public blockedDates: any[] = [];
  public blockedDatesColumns = ['period','blockedBy', 'actions'];

  public transactionTypes!: string[];
  public classifiers!: ClassifierModel[];

  public widgets = {
    dateBlocking: {
      icon: 'date_range',
      header: 'Date Blocking',
      description: 'Block the period in which operations with transactions and currency rates cannot be performed.',
    },

    classifierOrdering: {
      icon: 'sort',
      header: 'Classifiers ordering',
      description: 'Adjust the order in which the classifiers will be displayed in the system. Here you can specify the required types of transactions as well.',
    },
  }

  public blockedDatesForm!: FormGroup;

  constructor(
    private transactionsService: TransactionsService,
    private classifiersService: ClassifiersService,
    private router: Router,
    private blockedDatesService: BlockedDatesService,
    ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.loadDates();
    this.loadClassifiers();
    this.loadTransactionTypes();
  }
  
  private initializeForms(){
    this.blockedDatesForm = new FormGroup({
      from: new FormControl(new Date('01/01/0001'), [Validators.required]),
      to: new FormControl(new Date(), [Validators.required]),
    });
  }

  private loadDates(): void{
    this.isLoading = true;
    this.blockedDatesService.getBlockedDates().pipe(untilDestroyed(this)).subscribe((dates: any)=>{
      this.isLoading = false;
      this.blockedDates = dates;
    },
    error =>{
      this.isLoading = false;
      console.error(error);
    });
  }

  blockDate(){
    this.isLoading = true;
    const model = this.getModelFromForm();

    this.blockedDatesService.blockDate(model).pipe(untilDestroyed(this)).subscribe((res: any)=>{
      this.isLoading = false;
      if(res.isSuccess) this.loadDates();
    },
    error =>{
      console.error(error);
      this.isLoading = false;
    });
  }

  private getModelFromForm(): BlockedDateModel {
    return {
      dateFrom: moment(this.blockedDatesForm.value.from.getTime()).utc(true).toDate(),
      dateTo: moment(this.blockedDatesForm.value.to.getTime()).utc(true).toDate(),
      id: Guid.newGuid(),
      user: undefined!
    };
  }

  unlockDate(model: BlockedDateModel) {
    this.isLoading = true;

    this.blockedDatesService.deleteBlockedDate(model).pipe(untilDestroyed(this)).subscribe((res: any)=>{
      this.isLoading = false;
      if(res.isSuccess) this.loadDates();
    },
    error =>{
      this.isLoading = false;
      console.error(error);
    });
  }

  private loadTransactionTypes(): void{
    this.transactionsService.getTransactionTypes().pipe(untilDestroyed(this)).subscribe((types: any) =>{
      this.transactionTypes = types;
    },
    error =>{
      console.error(error);
    });
  }

  private loadClassifiers(){
    this.classifiersService.getClassifiers().pipe(untilDestroyed(this)).subscribe((classifiers: ClassifierModel[]) => {
      this.classifiers = classifiers.sort((e1,e2) => e1.orderWeight - e2.orderWeight);
    },
    error => {
      console.error(error);
    });
  }

  onChange(event: any, classifier: ClassifierModel){
    classifier.requiredTransactionTypes = event.value;
    this.classifiersService.updateClassifier(classifier).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res);
    },
    error => {
      console.error(error);
    });
  }

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.classifiers, event.previousIndex, event.currentIndex);
    this.saveOrderState();
  }

  private saveOrderState(): void{
    this.classifiers.forEach((e,i) => e.orderWeight = i);
    const data = this.classifiers.map(e => {return {id: e.id, orderWeight: e.orderWeight}});
    this.classifiersService.updateClassifiersOrder(data).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res);
    },
    error => {
      console.error(error);
    });
  }
}
