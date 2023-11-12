import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ActivityLogModel } from 'src/app/features/shared/models/activity-log.model';
import { ActivityLogsService } from '../../services/activity-logs.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit { 
  @ViewChild(MatSort) logsSort!: MatSort;

  public isLoading = true;

  public activityLogs: ActivityLogModel[] = [];

  public activityLogsData: MatTableDataSource<ActivityLogModel> = new MatTableDataSource();

  public readonly activityLogTableColumns = [ 'transactionId', 'userEmail', 'actionTime', 'action' ];

  constructor(
    private router: Router,
    private activityLogsService: ActivityLogsService) { }

  ngOnInit(): void {
    this.loadActivityLog();
  }

  private loadActivityLog(){
    this.activityLogsService.getActivityLogs()
    .pipe(untilDestroyed(this)).subscribe({
      next: (res: ActivityLogModel[] | unknown) => {
        this.activityLogs = res as ActivityLogModel[];

        this.activityLogsData = new MatTableDataSource(this.activityLogs);
        this.activityLogsData.sort = this.logsSort;
        this.activityLogsData.sortingDataAccessor = this.logsSortLogic;

        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private logsSortLogic(log: any, prop: any){
    return log[prop];
  }

  goTo(link: string){
    this.router.navigateByUrl(link);
  }

}
