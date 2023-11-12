import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription, take } from 'rxjs';
import { Column } from 'src/app/features/shared/component-models/column';
import { ConfirmationDialogModel } from 'src/app/features/shared/dialog-models/confirmation-dialog.model';
import { ConfirmationDialogComponent } from 'src/app/features/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { CategoryModel } from 'src/app/features/shared/models/category.model';
import { ClassifierModel } from 'src/app/features/shared/models/classifier.model';
import { Guid } from 'src/app/utilities/types/guid';
import { CreateUpdateCategoryComponent } from '../../dialogs/create-update-category/create-update-category.component';
import { CategoriesService } from '../../services/api/categories.service';
import { ClassifiersService } from '../../services/api/classifiers.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthorityService } from 'src/app/features/shared/services/local/authority.service';
import { Roles } from 'src/app/core/contracts/business-logic-configuration';

@UntilDestroy()
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  isLoading = false;
  categories!: CategoryModel[];
  displayedColumns: Column[] = [
    new Column('name', 'Name'),
    new Column('description', 'Description'),
  ];

  public menuActions = [
    {
      icon: 'add',
      caption: 'Add New Category',
      action: (u: any) => this.createCategory(u),
    },
    {
      icon: 'add',
      caption: 'Add New Sub Category',
      action: (u: any) => this.createSubCategory(u),
    },
    {
      icon: 'edit',
      caption: 'Update Category',
      action: (u: any) => this.updateCategory(u),
    },
    {
      icon: 'delete',
      caption: 'Delete Category',
      action: (u: any) => this.deleteCategory(u),
    },
  ];

  public emptyMenuActions = [
    {
      icon: 'add',
      caption: 'Add New Category',
      action: (u: any) => this.createCategory(u),
    },
  ];

  public allowActions: boolean = false;

  private sub!: Subscription;

  public classifier?: ClassifierModel;
  public categoryTypes?: any[];

  constructor(
    private classifiersService: ClassifiersService,
    private categoriesService: CategoriesService,
    private authorityService: AuthorityService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.classifier =
      this.router.getCurrentNavigation()?.extras?.state?.['data'];
  }

  ngOnInit() {
    this.isLoading = true;

    this.loadView();
    this.loadTypes();

    this.sub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (!this.classifier || event['url'].includes(this.classifier!.id))
          return;
        this.classifier = undefined;

        this.loadView();
      });
    this.menuActionsInit();
  }

  private menuActionsInit() {
    this.allowActions = !this.authorityService.currentUserIs(Roles.Reviewer);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  displayError(header: string, description: string) {
    const dialogModel: ConfirmationDialogModel = {
      header: header,
      description: description,
    };

    this.dialog.open(ConfirmationDialogComponent, { data: dialogModel });
  }

  selectCategory(category: CategoryModel) {
    this.router.navigate(['transactions'], {
      queryParams: {categories: [category.id]}
    });
  }

  private loadView() {
    this.isLoading = true;
    this.route.params
      .pipe(take(1))
      .pipe(untilDestroyed(this))
      .subscribe((params) => {
        if (this.classifier) {
          this.loadCategories(this.classifier.id);
          return;
        }

        this.loadClassifier(params['classifierId']);
      });
  }

  private loadTypes() {
    this.categoriesService
      .getCategoryTypes()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: any) => {
          this.categoryTypes = res;
        },
        error: (error) => {
          console.error(error);

          this.displayError('Failed to load types', error.message);
        },
      });
  }

  private loadClassifier(id: Guid) {
    this.classifiersService
      .getClassifiers()
      .pipe(take(1))
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: ClassifierModel[]) => {
          this.classifier = res.find((e) => e.id === id)!;
          this.loadCategories(this.classifier.id);
        },
        error: (error) => {
          console.error(error);

          this.displayError('Failed to load classifier', error.message);
        },
      });
  }

  private loadCategories(id: Guid) {
    this.categoriesService
      .getCategoriesByClassifier(id)
      .pipe(take(1))
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: any) => {
          this.categories = res;
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);

          this.displayError('Failed to load categories', error.message);
        },
      });
  }

  private createCategory(node: any) {
    const folderData = { path: node?.path?.trim().length ? node.path : '/' };
    const data = {
      category: undefined,
      classifier: this.classifier,
      categoryTypes: this.categoryTypes,
      folderData: folderData,
      parent: node?.item ?? undefined,
    };

    this.dialog
      .open(CreateUpdateCategoryComponent, { data: data })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((newCategory) => {
        if (!newCategory) return;

        this.categoriesService
          .createCategory(newCategory)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: any) => {
              if (res.isSuccess) this.loadView();
            },
            error: (error) => {
              console.error(error);

              this.displayError('Failed to create category', error.message);
            },
          });
      });
  }

  private createSubCategory(node: any) {
    const folderData = { path: `${node.path}${node.item.name}/` };
    const data = {
      category: undefined,
      classifier: this.classifier,
      categoryTypes: this.categoryTypes,
      folderData: folderData,
      parent: node.item,
    };

    this.dialog
      .open(CreateUpdateCategoryComponent, { data: data })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((newCategory) => {
        if (!newCategory) return;

        this.categoriesService
          .createCategory(newCategory)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: any) => {
              if (res.isSuccess) this.loadView();
            },
            error: (error) => {
              console.error(error);

              this.displayError('Failed to create sub category', error.message);
            },
          });
      });
  }

  private updateCategory(node: any) {
    const folderData = { path: node.item.path };
    const data = {
      category: node.item,
      classifier: this.classifier,
      categoryTypes: this.categoryTypes,
      folderData: folderData,
    };

    this.dialog
      .open(CreateUpdateCategoryComponent, { data: data })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((newCategory) => {
        if (!newCategory) return;

        this.categoriesService
          .updateCategory(newCategory)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: any) => {
              if (res.isSuccess) this.loadView();
            },
            error: (error) => {
              console.error(error);

              this.displayError('Failed to update category', error.message);
            },
          });
      });
  }

  private deleteCategory(node: any) {
    const dialogModel: ConfirmationDialogModel = {
      header: 'Are you sure delete this category?',
      description: 'If you delete this category you can`t recover it.',
    };

    this.dialog
      .open(ConfirmationDialogComponent, { data: dialogModel })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((isConfirmed) => {
        if (!isConfirmed) return;

        this.categoriesService
          .deleteCategory(node.item)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: any) => {
              if (!res.isSuccess) {
                this.displayError('Action denied', res.message);
                return;
              }

              this.loadView();
            },
            error: (error) => {
              console.error(error);

              this.displayError('Failed to delete category', error.message);
            },
          });
      });
  }

  public folderSelector(cat: CategoryModel) {
    return cat.path;
  }

  public itemSelector(cat: CategoryModel) {
    return cat;
  }

  public nameSelector(cat: CategoryModel) {
    return cat.name;
  }

  public categoriesSort(cat1: CategoryModel, cat2: CategoryModel) {
    return (cat2.path + cat2.name).localeCompare(cat1.path + cat1.name);
  }

  goTo(link: string) {
    this.router.navigateByUrl(link);
  }
}
