import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { ClassifiersDashboardComponent } from './components/classifiers-dashboard/classifiers-dashboard.component';

const routes: Routes = [
  { path: '', component: ClassifiersDashboardComponent },
  { path: 'classifier/:classifierId', component: CategoriesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassifiersRoutingModule { }
