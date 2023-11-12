import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';
import { AuditModel } from '../../shared/models/audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService extends AbstractRestService {
  constructor(protected override http: HttpClient){ super(http); }

  public getAuditLogs() {
    return this.get('auditlogs/auditlogs');
  }

  public undoAction(auditModel: AuditModel) {
    return this.delete('auditlogs/undo-action', auditModel.id);
  }
}


