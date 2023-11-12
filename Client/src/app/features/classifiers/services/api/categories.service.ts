import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel } from 'src/app/features/shared/models/category.model';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';
import { Guid } from 'src/app/utilities/types/guid';

@Injectable({ providedIn: 'root' })
export class CategoriesService extends AbstractRestService {
  constructor(protected override http: HttpClient){ super(http); }

  public getCategories() {
    return this.get<CategoryModel[]>('categories/categories');
  }

  public getCategoryTypes() {
    return this.get('categories/category-types');
  }

  public getCategoriesByClassifier(id: Guid) {
    return this.get<CategoryModel[]>('categories/categories/'+id);
  }

  public createCategory(category: CategoryModel) {
    return this.putItem('categories/create-category', category);
  }

  public updateCategory(category: CategoryModel) {
    return this.postItem('categories/update-category', category);
  }

  public deleteCategory(category: CategoryModel) {
    return this.delete('categories/delete-category', category.id);
  }
}
