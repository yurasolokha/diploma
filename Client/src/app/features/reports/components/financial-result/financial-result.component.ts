import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassifiersService } from 'src/app/features/classifiers/services/api/classifiers.service';
import { CurrenciesService } from 'src/app/features/currencies/services/api/currencies.service';
import { ClassifierModel } from 'src/app/features/shared/models/classifier.model';
import { CurrencyModel } from 'src/app/features/shared/models/currency.model';
import { TurnoverRateReportRequestModel } from 'src/app/features/shared/models/reports/turnover-rate-report-request.model';
import { TransactionsService } from 'src/app/features/transactions/services/api/transactions.service';
import { ReportsService } from '../../services/api/reports.service';
import Sunburst from 'sunburst-chart';
import { TurnoverRateReportModel } from 'src/app/features/shared/models/reports/turnover-rate-report.model';
import { TurnoverRateReportItem } from 'src/app/features/shared/models/reports/turnover-rate-report-item.model';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import {
  TreeFlatNode,
  TreeNode,
} from 'src/app/features/shared/component-models/tree-node';
import * as moment from 'moment';
import { AccountFilterModel } from 'src/app/features/shared/models/account-filter.model';
import { AccountsService } from 'src/app/features/accounts/services/api/accounts.service';
import { AccountModel } from 'src/app/features/shared/models/account.model';
import { getDefaultFromTo } from 'src/app/utilities/defaults/form-defaults';
import { BusinessLogicConfiguration } from 'src/app/core/contracts/business-logic-configuration';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store, select } from '@ngrx/store';
import { selectCurrenciesFeature } from 'src/app/core/store/currency/currency.selectors';

@UntilDestroy()
@Component({
  templateUrl: './financial-result.component.html',
  styleUrls: ['./financial-result.component.scss'],
})
export class FinancialResultComponent implements OnInit {
  BusinessLogicConfiguration = BusinessLogicConfiguration;

  public isLoading: boolean = false;
  public goTo(link: string) {
    this.router.navigateByUrl(link);
  }

  public form!: FormGroup;

  public currencies$ = this.store.pipe(select(selectCurrenciesFeature));
  public accounts!: AccountModel[];
  public classifiers!: ClassifierModel[];
  public transactionTypes!: string[];

  public dataExists: boolean = false;

  public readonly chartId = 'chart-wrapper';

  public maxDiff: any = null;
  public minDiff: any = null;
  public avgDiff: any = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private accountsService: AccountsService,
    private reportsService: ReportsService,
    private transactionsService: TransactionsService,
    private classifiersService: ClassifiersService,
    public store: Store,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTypes();
    this.loadClassifiers();
    this.loadAccounts();
    this.initializeForm();
  }

  InputValidation(formControlName: string): boolean {
    const inputValue = this.form.controls[formControlName];

    return inputValue.invalid && inputValue.dirty;
  }

  private loadAccounts() {
    this.accountsService
      .getAccounts(new AccountFilterModel())
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: any) => {
          this.accounts = res;
        },
        error: (error) => {
          console.error(error);

          if (error.message) {
            this.snackBar.open(error.message, undefined, { duration: 2000 });
          }
        },
      });
  }

  private loadTypes(): void {
    this.transactionsService
      .getTransactionTypes()
      .pipe(untilDestroyed(this))
      .subscribe(
        (res: any) => {
          this.transactionTypes = res.filter((e: any) => e !== 'Transfer'); // хотіли трансфер забрати
          this.form.controls['types'].setValue(this.transactionTypes);
        },
        (error) => {
          console.log(error);

          if (error.message) {
            this.snackBar.open(error.message, undefined, { duration: 2000 });
          }
        }
      );
  }

  private loadClassifiers(): void {
    this.classifiersService
      .getClassifiers()
      .pipe(untilDestroyed(this))
      .subscribe(
        (res: ClassifierModel[]) => {
          this.classifiers = res;
          this.form.controls['classifier'].setValue(this.classifiers[0]);
        },
        (error) => {
          console.log(error);

          if (error.message) {
            this.snackBar.open(error.message, undefined, { duration: 2000 });
          }
        }
      );
  }

  private initializeForm(): void {
    const dates = getDefaultFromTo();

    this.form = this.formBuilder.group({
      from: [dates.from, [Validators.required]],
      to: [dates.to, [Validators.required]],
      accounts: [undefined],
      types: [undefined, [Validators.required]],
      currency: [undefined, [Validators.required]],
      classifier: [undefined, [Validators.required]],
    });
  }

  applyFilter(): void {
    if (this.form.invalid) return;

    const request = this.form.getRawValue();

    if (!request.accounts?.length) return;

    this.isLoading = true;

    this.loadReport(request);
  }

  private loadReport(request: TurnoverRateReportRequestModel) {
    this.reportsService
      .getTurnoverRateReport(request)
      .pipe(untilDestroyed(this))
      .subscribe(
        (res: any) => {
          this.isLoading = false;

          if (!res.expenseRates.length && !res.incomeRates.length) {
            this.dataExists = false;
            this.snackBar.open(
              'There is no data to display, please verify input filter',
              undefined,
              { duration: 2000 }
            );
          } else {
            this.showReport(res);
            this.showTable(res);
            this.showDiffsData(res as any);
            this.dataExists = true;
          }
        },
        (error) => {
          console.log(error);
          this.isLoading = false;

          if (error.message) {
            this.snackBar.open(error.message, undefined, { duration: 2000 });
          }
        }
      );
  }

  private showReport(report: TurnoverRateReportModel) {
    if (report.expenseRates.length <= 0 && report.incomeRates.length <= 0)
      return;

    document!.getElementById(this.chartId)!.innerHTML = '';

    Sunburst()
      .width(760)
      .centerRadius(0)
      .maxLevels(10)
      .showLabels(true)
      .data(this.getNodes(report))
      .color(this.nodeColor)
      .tooltipTitle(this.nodeTitle)
      .tooltipContent(this.nodeTooltipContent)(
      document.getElementById(this.chartId)!
    );
  }

  private showDiffsData(report: TurnoverRateReportModel) {
    this.maxDiff = report.maxDateDiff;
    this.minDiff = report.minDateDiff;
    this.avgDiff = report.avgDateDiff;
  }

  private nodeColor(val: any): any {
    return val.color;
  }
  private nodeTitle(val: any): any {
    return val.title;
  }
  private nodeTooltipContent(data: any, node: any): any {
    return `<i>${
      data.name === 'root'
        ? data.result.toFixed(2)
        : (node.value * data.coefficient).toFixed(2)
    }</i>`;
  }

  private hslFrom = (color: any) => `hsl(${color.h},${color.s}%,${color.l}%)`;

  private getNodes(report: TurnoverRateReportModel): any {
    let expense = report.expenseRates.reduce(
      (sum, current) => sum + current.value,
      0
    );
    let income = report.incomeRates.reduce(
      (sum, current) => sum + current.value,
      0
    );

    let iCol = { h: 120, s: 60, l: 50 };
    let uiCol = { h: 120, s: 75, l: 33 };
    let eCol = { h: 0, s: 100, l: 50 };
    let ueCol = { h: 0, s: 60, l: 50 };

    let tree = {
      name: `Result`,
      color: 'hsl(280, 100%, 50%)',
      title: 'Finance result',
      result: income - Math.abs(expense),
      coefficient: 1,
      children: [
        {
          name: 'Expense',
          color: this.hslFrom(eCol),
          title: 'Expense',
          coefficient: -1,
          children: this.getSubTree(report.expenseRates, 1, -1, eCol),
        },
        {
          name: 'Unknown Expense',
          color: this.hslFrom(ueCol),
          value:
            (report.expenseRates.find((e) => e.path === 'Unknown')?.value ??
              0.0) * -1,
          title: 'Unknown Expense',
          coefficient: -1,
          children: [],
        },
        {
          name: 'Income',
          color: this.hslFrom(iCol),
          title: 'Income',
          coefficient: 1,
          children: this.getSubTree(report.incomeRates, 1, 1, iCol),
        },
        {
          name: 'Unknown Income',
          color: this.hslFrom(uiCol),
          value:
            report.incomeRates.find((e) => e.path === 'Unknown')?.value ?? 0.0,
          title: 'Unknown Income',
          coefficient: 1,
          children: [],
        },
      ],
    };
    return tree;
  }

  private getSubTree(
    items: TurnoverRateReportItem[],
    depth: number,
    coefficient: number,
    color: any
  ) {
    const subTree: any[] = [];

    items.forEach((item) => {
      const path = item.path.split('/');

      if (depth >= path.length || !path[depth]) return;

      if (!subTree.some((e) => e.name === path[depth])) {
        subTree.push({
          coefficient: coefficient,
          name: path[depth],
          color: this.hslFrom({
            h: color.h,
            s: color.s,
            l: color.l - depth * 10,
          }),
          title: path[depth],
          children: [],
          value: 0.0,
        });
      }

      const childItems = items.filter(
        (e) => e.path.split('/')[depth] === path[depth]
      );
      const node = subTree.find((e) => e.name === path[depth]);
      const children = this.getSubTree(
        childItems,
        depth + 1,
        coefficient,
        color
      );
      node.children = children;

      if (children.length >= childItems.length) return;

      const self = childItems.find((e) => e.path.split('/')[depth + 1] === '');

      if (self) node.value = self!.value > 0 ? self!.value : -self!.value;
    });

    return subTree;
  }

  private flatNodeMap = new Map<TreeFlatNode, TreeNode>();
  private nestedNodeMap = new Map<TreeNode, TreeFlatNode>();

  private _transformer = (node: TreeNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);

    const flatNode =
      existingNode ||
      new TreeFlatNode(
        node.type,
        node.item,
        !!node.children.length,
        level,
        node.folderData
      );

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);

    return flatNode;
  };

  treeControl = new FlatTreeControl<TreeFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  treeData = new MatTreeFlatDataSource(
    this.treeControl,
    <any>this.treeFlattener
  );

  public dataSource = new MatTreeFlatDataSource(
    this.treeControl,
    this.treeFlattener
  );

  hasChild = (_: number, node: TreeFlatNode) => node.expandable;
  hasNoContent = (_: number, node: TreeFlatNode) => !node.item.name;

  private showTable(report: TurnoverRateReportModel) {
    let income = 0;
    let expense = 0;
    let generalAmount = 0;
    let generalAmountNormalized = 0;
    let normalizedIncome = 0;
    let normalizedExpense = 0;

    let expenseUnknown =
      report.expenseRates.find((e) => e.path === 'Unknown')?.value ?? 0.0;
    let incomeUnknown =
      report.incomeRates.find((e) => e.path === 'Unknown')?.value ?? 0.0;

    report.expenseRates.forEach((e) => {
      generalAmount += e.value;
      generalAmountNormalized += Math.abs(e.value);
      if (e.path !== 'Unknown') {
        expense += e.value;
        normalizedExpense += Math.abs(e.value);
      }
    });

    report.incomeRates.forEach((e) => {
      generalAmount += e.value;
      generalAmountNormalized += Math.abs(e.value);
      if (e.path !== 'Unknown') {
        income += e.value;
        normalizedIncome += Math.abs(e.value);
      }
    });

    const root: any = {
      folderData: 'Finance result',
      item: {
        amount: generalAmount,
        normalizedAmount: generalAmountNormalized,
        generalNormalizedAmount: generalAmountNormalized,
        parent: undefined,
      },
      children: [],
    };

    root.item.parent = <any>root;

    const expenseRoot: any = {
      folderData: 'Expense',
      item: {
        amount: expense,
        normalizedAmount: normalizedExpense,
        generalNormalizedAmount: generalAmountNormalized,
        parent: root,
      },
      children: undefined,
    };

    expenseRoot.children = <any>(
      this.getSubTableTree(report.expenseRates, expenseRoot)
    );

    const unknownExpenseRoot: any = {
      folderData: 'Unknown Expense',
      item: {
        amount: expenseUnknown,
        normalizedAmount: Math.abs(expenseUnknown),
        generalNormalizedAmount: generalAmountNormalized,
        parent: root,
      },
      children: [],
    };

    const incomeRoot: any = {
      folderData: 'Income',
      item: {
        amount: income,
        normalizedAmount: normalizedIncome,
        generalNormalizedAmount: generalAmountNormalized,
        parent: root,
      },
      children: undefined,
    };

    incomeRoot.children = <any>(
      this.getSubTableTree(report.incomeRates, incomeRoot)
    );

    const unknownIncomeRoot = {
      folderData: 'Unknown Income',
      item: {
        amount: incomeUnknown,
        normalizedAmount: Math.abs(incomeUnknown),
        generalNormalizedAmount: generalAmountNormalized,
        parent: root,
      },
      children: [],
    };

    if (expenseRoot.item.amount) root.children.push(expenseRoot);
    if (unknownExpenseRoot.item.amount) root.children.push(unknownExpenseRoot);
    if (incomeRoot.item.amount) root.children.push(incomeRoot);
    if (unknownIncomeRoot.item.amount) root.children.push(unknownIncomeRoot);

    this.dataSource.data = [root];

    this.treeControl.expand(this.nestedNodeMap.get(root)!);
  }

  private getSubTableTree(
    items: TurnoverRateReportItem[],
    parent: TreeNode
  ): TreeNode[] {
    const depth = 1;
    const subTree: TreeNode[] = [];

    items.forEach((item) => {
      const path = item.path.split('/');

      if (!path?.[depth]) return;

      let node: any = subTree.find((e) => e.folderData === path[depth]);

      if (node) {
        node.item.amount += item.value;
        node.item.normalizedAmount += Math.abs(item.value);
      } else {
        node = {
          folderData: path[depth],
          item: {
            generalNormalizedAmount: parent.item.generalNormalizedAmount,
            normalizedAmount: Math.abs(item.value),
            amount: item.value,
            parent: parent,
          },
          children: [],
        };

        subTree.push(node);
      }

      if (path[depth + 1])
        this.updateChildren(item.value, node, path, depth + 1);
    });

    return subTree;
  }

  private updateChildren(
    amount: number,
    parent: TreeNode,
    path: string[],
    depth: number
  ) {
    while (path[depth]) {
      let child: any = parent.children.find(
        (e) => e.folderData === path[depth]
      );

      if (child) {
        child.item.amount += amount;
        child.item.normalizedAmount += Math.abs(amount);
      } else {
        child = {
          folderData: path[depth],
          item: {
            generalNormalizedAmount: parent.item.generalNormalizedAmount,
            normalizedAmount: Math.abs(amount),
            amount: amount,
            parent: parent,
          },
          children: [],
        };
        parent.children.push(child);
      }

      parent = child;
      depth++;
    }
  }

  getParentTurnover(node: TreeFlatNode): number {
    return Math.abs(
      node.item.normalizedAmount / node.item.parent.item.normalizedAmount
    );
  }

  getGeneralTurnover(node: TreeFlatNode): number {
    return Math.abs(
      node.item.normalizedAmount / node.item.generalNormalizedAmount
    );
  }

  changeDateDay(evt: any, control: string) {
    if (!this.form.controls[control]) return;

    const date = moment(this.form.controls[control].value);

    if (evt.deltaY < 0)
      this.form.controls[control].setValue(date.add(1, 'day').toDate());
    else if (evt.deltaY > 0)
      this.form.controls[control].setValue(date.subtract(1, 'day').toDate());

    evt.preventDefault();
    evt.stopPropagation();
  }

  changeMonthPeriod(direction: any) {
    const from = moment(this.form.controls['from'].value);
    const to = moment(this.form.controls['to'].value);

    if (direction) {
      this.form.controls['from'].setValue(from.add(1, 'month').toDate());
      this.form.controls['to'].setValue(to.add(1, 'month').toDate());
    } else {
      this.form.controls['from'].setValue(from.subtract(1, 'month').toDate());
      this.form.controls['to'].setValue(to.subtract(1, 'month').toDate());
    }
  }

  formValueChange(propName: string, value: any) {
    this.form.controls[propName].setValue(value);
  }
}
