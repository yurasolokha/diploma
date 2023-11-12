export class AuditModel
{
  id!: string;
  userId!: string;
  type!: string;
  tableName!: string;
  date!: Date;
  oldValues!: string;
  newValues!: string;
  affectedColumns!: string;
  primaryKey!: string;
}