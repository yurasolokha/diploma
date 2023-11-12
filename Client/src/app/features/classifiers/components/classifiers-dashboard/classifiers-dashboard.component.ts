import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CardComponentModel } from 'src/app/features/shared/component-models/card';
import { ClassifierModel } from 'src/app/features/shared/models/classifier.model';
import { CreateClassifierComponent } from '../../dialogs/create-classifier/create-classifier.component';
import { ClassifiersService } from '../../services/api/classifiers.service';
import { ConfirmationDialogComponent } from 'src/app/features/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogModel } from 'src/app/features/shared/dialog-models/confirmation-dialog.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthorityService } from 'src/app/features/shared/services/local/authority.service';
import { Roles } from 'src/app/core/contracts/business-logic-configuration';

@UntilDestroy()
@Component({
  selector: 'app-classifiers-dashboard',
  templateUrl: './classifiers-dashboard.component.html',
  styleUrls: ['./classifiers-dashboard.component.scss'],
})
export class ClassifiersDashboardComponent implements OnInit {
  public cards!: CardComponentModel[];

  public menuActions = [
    {
      icon: 'edit',
      caption: 'Update Classifier',
      action: (u: CardComponentModel) => {
        this.updateClassifier(u);
      },
    },
    {
      icon: 'delete',
      caption: 'Delete Classifier',
      action: (u: CardComponentModel) => {
        this.deleteClassifier(u);
      },
    },
  ];

  public allowActions: boolean = false;

  constructor(
    private dialog: MatDialog,
    private readonly router: Router,
    private authorityService: AuthorityService,
    private readonly classifiersService: ClassifiersService
  ) {}

  ngOnInit(): void {
    this.loadClassifiers();
    this.menuActionsInit();
  }

  private menuActionsInit() {
    this.allowActions = !this.authorityService.currentUserIs(Roles.Reviewer);
  }

  displayError(header: string, description: string) {
    const dialogModel: ConfirmationDialogModel = {
      header: header,
      description: description,
    };

    this.dialog.open(ConfirmationDialogComponent, { data: dialogModel });
  }

  private loadClassifiers() {
    this.classifiersService
      .getClassifiers()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: any) => {
          this.cards = res
            .sort((e1: any, e2: any) => e1.orderWeight - e2.orderWeight)
            .map((classifier: ClassifierModel) => ({
              headerCaption: classifier.pluralName,
              headerIcon: 'class',
              description: '',
              footerCaption: 'Go to ' + classifier.pluralName,
              link: 'classifiers/classifier/' + classifier.id,
              data: classifier,
            }));
        },
        error: (error) => {
          console.error(error);

          this.displayError('Failed to load classifiers', error.message);
        },
      });
  }

  addClassifier() {
    this.dialog
      .open(CreateClassifierComponent, { data: { role: undefined } })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((classifier: any) => {
        if (!classifier) return;

        this.classifiersService
          .createClassifier(classifier)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: any) => {
              if (res.isSuccess) this.loadClassifiers();
            },
            error: (error) => {
              console.error(error);

              this.displayError('Failed to add classifier', error.message);
            },
          });
      });
  }

  private updateClassifier(item: CardComponentModel) {
    const data = {
      classifier: item.data,
    };

    this.dialog
      .open(CreateClassifierComponent, { data: data })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((newClassifier) => {
        if (!newClassifier) return;

        this.classifiersService
          .updateClassifier(newClassifier)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: any) => {
              if (res.isSuccess) this.loadClassifiers();
            },
            error: (error) => {
              console.error(error);

              this.displayError('Failed to update classifier', error.message);
            },
          });
      });
  }

  private deleteClassifier(item: CardComponentModel) {
    const dialogModel: ConfirmationDialogModel = {
      header: 'Are you sure delete this classifier?',
      description: 'If you delete this classifier you can`t recover it.',
    };

    this.dialog
      .open(ConfirmationDialogComponent, { data: dialogModel })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((isConfirmed) => {
        if (!isConfirmed) return;

        this.classifiersService
          .deleteClassifier(item.data)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: any) => {
              if (res.isSuccess) {
                this.loadClassifiers();
                return;
              }

              this.displayError('Action denied', res.message);
            },
            error: (error) => {
              console.error(error);

              this.displayError('Failed to delete classifier', error.message);
            },
          });
      });
  }

  goTo(card: CardComponentModel) {
    this.router.navigate([card.link], { state: { data: card.data } });
  }

  public menuTopLeftPosition = { x: '0', y: '0' };
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger;
  public onRightClick(event: MouseEvent, item: any, actions: any) {
    if (!actions || !actions.length) return;
    if (!this.allowActions) return;

    event.preventDefault();

    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';

    this.matMenuTrigger.menuData = { item: { actions: actions, data: item } };

    this.matMenuTrigger.openMenu();
  }
}
