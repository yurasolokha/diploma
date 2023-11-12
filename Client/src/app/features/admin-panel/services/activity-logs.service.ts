import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';

@Injectable({providedIn: 'root'})
export class ActivityLogsService extends AbstractRestService {

  constructor(protected override http: HttpClient){ super(http); }

  public getActivityLogs() {
    return this.get('activitylogs/logs');
  }
}
