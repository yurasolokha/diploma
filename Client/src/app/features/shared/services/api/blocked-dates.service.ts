import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';
import { BlockedDateModel } from '../../models/blocked-date.model';

@Injectable({providedIn: 'root'})
export class BlockedDatesService extends AbstractRestService {

  constructor(protected override http: HttpClient){ super(http); }

  public blockDate(date: BlockedDateModel) {
    return this.putItem('administrative/block-date', date);
  }

  public updateBlockedDate(date: BlockedDateModel) {
    return this.postItem('administrative/update-blocked-date', date);
  }

  public deleteBlockedDate(date: BlockedDateModel) {
    return this.delete('administrative/delete-blocked-date', date.id!);
  }

  public getBlockedDates() {
    return this.get('administrative/blocked-dates');
  }
}