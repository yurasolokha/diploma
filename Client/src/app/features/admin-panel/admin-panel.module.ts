import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { SharedModule } from '../shared/shared.module';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { CreateUpdateUserComponent } from './dialogs/create-update-user/create-update-user.component';
import { CreateUpdateRoleComponent } from './dialogs/create-update-role/create-update-role.component';
import { CreateUpdateCompanyComponent } from './dialogs/create-update-company/create-update-company.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { DataImportExportComponent } from './components/data-import-export/data-import-export.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AccessManagementComponent } from './components/access-management/access-management.component';
import { AuditLogComponent } from './components/audit-log/audit-log.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import { AccessTableComponent } from './components/access-management/components/access-table/access-table.component';
import { UserFullNamePipe } from '../shared/pipes/full-name.pipe';

@NgModule({
  declarations: [
    AdminPanelComponent,
    UserManagementComponent,
    ActivityLogComponent,
    CreateUpdateUserComponent,
    CreateUpdateRoleComponent,
    CreateUpdateCompanyComponent,
    ConfigurationComponent,
    DataImportExportComponent,
    AccessManagementComponent,
    AuditLogComponent,
    AccessTableComponent,
  ],
  imports: [
    CommonModule,
    AdminPanelRoutingModule,
    SharedModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    DragDropModule,
    MatProgressBarModule,
    MatDialogModule,
    MatButtonModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatTabsModule,
  ],
  providers: [
    UserFullNamePipe,
  ]
})
export class AdminPanelModule {}
