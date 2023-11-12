import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuditModel } from 'src/app/features/shared/models/audit.model';
import { AuditLogService } from '../../services/audit-log.service';
import { DataConvention } from 'src/app/core/contracts/data.convention';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogModel } from 'src/app/features/shared/dialog-models/confirmation-dialog.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/features/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent implements OnInit { 
  DataConvention = DataConvention;

  @ViewChild(MatTooltipModule) tooltip!: MatTooltipModule;
  @ViewChild(MatSort) logsSort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public isLoading = true;

  public auditLogs: AuditModel[] = [];

  public auditLogsData: MatTableDataSource<AuditModel> = new MatTableDataSource();

  public readonly auditLogTableColumns = [ 'tableName', 'primaryKey', 'userId', 'userName', 'type', 'newValues', 'oldValues', 'date' ];
  public menuActions = [
    { icon: 'cancel', caption: 'Cancel action', action: (u: any) => this.cancelAction(u) },
  ]
  constructor(
    private router: Router,
    private auditLogsService: AuditLogService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadAuditLog();
  }

  private loadAuditLog(){
    this.auditLogsService.getAuditLogs()
    .pipe(untilDestroyed(this)).subscribe({
      next: (res: AuditModel[] | unknown) => {
        this.auditLogs = res as AuditModel[];

        this.auditLogsData = new MatTableDataSource(this.auditLogs);
        this.auditLogsData.sort = this.logsSort;
        this.auditLogsData.sortingDataAccessor = this.logsSortLogic;
        this.auditLogsData.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  cancelAction(model: AuditModel){
    if(!model) return;
    
    const dialogModel: ConfirmationDialogModel = {
      header: 'Are you sure undo this action?',
      description: 'If you delete, you can recover it.',
    };

    this.dialog
    .open(ConfirmationDialogComponent, {data: dialogModel})
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(isConfirmed => {
      if(isConfirmed) this._undoAction(model);
    });
  }

  getTooltip(value: string) {
    return value;
  }

  private _undoAction(model: AuditModel) {
    this.isLoading = true;

    this.auditLogsService.undoAction(model).pipe(untilDestroyed(this)).subscribe({
      next: (res: any) => {
        this.snackBar.open(res.message!, undefined, { duration: 1500 });
        this.isLoading = false;
        if(res.isSuccess) this.loadAuditLog();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  isOverflow(el: HTMLElement): boolean {
    var curOverflow = el.style.overflow;
    if (!curOverflow || curOverflow === "visible")
      el.style.overflow = "hidden";
    var isOverflowing = el.clientWidth < el.scrollWidth
      || el.clientHeight < el.scrollHeight;
    el.style.overflow = curOverflow;
    return isOverflowing;
  }

  private logsSortLogic(log: any, prop: any){
    return log[prop];
  }

  goTo(link: string){
    this.router.navigateByUrl(link);
  }
  public menuTopLeftPosition =  {x: '0', y: '0'}
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger!: MatMenuTrigger;
  onRightClick(event: MouseEvent, item: any, actions: any) {
    event.preventDefault();

    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';

    this.matMenuTrigger.menuData = { item: { actions: actions, data: item } }

    this.matMenuTrigger.openMenu();
  }

  ngAfterViewInit() {
    this.auditLogsData.paginator = this.paginator;
  }
}
