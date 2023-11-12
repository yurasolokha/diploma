import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassifiersRoutingModule } from './classifiers-routing.module';
import { ClassifiersDashboardComponent } from './components/classifiers-dashboard/classifiers-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { CategoriesComponent } from './components/categories/categories.component';
import { MatIconModule } from '@angular/material/icon';
import { CreateClassifierComponent } from './dialogs/create-classifier/create-classifier.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CreateUpdateCategoryComponent } from './dialogs/create-update-category/create-update-category.component';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    ClassifiersDashboardComponent,
    CategoriesComponent,
    CreateClassifierComponent,
    CreateUpdateCategoryComponent
  ],
  imports: [
    CommonModule,
    ClassifiersRoutingModule,
    SharedModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatMenuModule,
  ]
})
export class ClassifiersModule { }
