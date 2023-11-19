import { NgModule } from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { NameInitialsPipe } from './pipes/name-initials.pipe';
import { CardComponent } from './components/card/card.component';
import { ContentWidgetComponent } from './components/content-widget/content-widget.component';
import { DropFileComponent } from './components/drop-file/drop-file.component';
import { DropFileDirective } from './directives/drop-file.directive';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { NotificationDialogComponent } from './dialogs/notification-dialog/notification-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogLayoutComponent } from './dialogs/dialog-layout/dialog-layout.component';
import { SelectableRowDirective } from './directives/selectable-row.directive';
import { DraggableColumnDirective } from './directives/draggable-column.directive';
import { ResizableColumnDirective } from './directives/resizable-column.directive';
import { UserInitialsPipe } from './pipes/user-initials.pipe';
import { UserFullNamePipe } from './pipes/full-name.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomTreeComponent } from './components/custom-tree/custom-tree.component';
import { MatMenuModule } from '@angular/material/menu';
import { TemplateNameDirective } from './directives/template-name.directive';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateRangePipe } from './pipes/date-range.pipe';
import { AddNewCardComponent } from './components/add-new-card/add-new-card.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { AsStringPipe } from './pipes/as-string.pipe';
import { MatSelectModule } from '@angular/material/select';
import { CustomTreeSelectComponent } from './components/custom-tree-select/custom-tree-select.component';
import { ImportDialogComponent } from './dialogs/import-dialog/import-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserAccessesControlComponent } from './user-accesses-control/user-accesses-control.component';
import {MatListModule} from "@angular/material/list";
import { MoneyFormatPipe } from './pipes/money-format.pipe';

const components = [
  NavBarComponent,
  LoaderComponent,
  ConfirmationDialogComponent,
  NotificationDialogComponent,
  CardComponent,
  ContentWidgetComponent,
  DropFileComponent,
  DialogLayoutComponent,
  CustomTreeComponent,
  AddNewCardComponent,
  ImportDialogComponent,
  CustomTreeSelectComponent,
];

const pipes = [
  NameInitialsPipe,
  UserInitialsPipe,
  UserFullNamePipe,
  AsStringPipe,
  DateRangePipe,
  MoneyFormatPipe
];

const directives = [
  DropFileDirective,
  SelectableRowDirective,
  ResizableColumnDirective,
  DraggableColumnDirective,
];

@NgModule({
  declarations: [
    ...components,
    ...pipes,
    ...directives,
    TemplateNameDirective,
    ClickOutsideDirective,
    UserAccessesControlComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTreeModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatListModule,
  ],
  providers: [DecimalPipe],
  exports: [
    ...components,
    ...pipes,
    ...directives,
    MatSnackBarModule,
    TemplateNameDirective,
    ClickOutsideDirective,
    UserAccessesControlComponent,
  ],
})
export class SharedModule {}
