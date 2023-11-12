import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessManagementComponent } from './components/access-management/access-management.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { DataImportExportComponent } from './components/data-import-export/data-import-export.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { AuditLogComponent } from './components/audit-log/audit-log.component';

const routes: Routes = [
  { path: '', component: AdminPanelComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'activity-log', component: ActivityLogComponent },
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'data-import-export', component: DataImportExportComponent },
  { path: 'access-management', component: AccessManagementComponent },
  { path: 'audit-log', component: AuditLogComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
