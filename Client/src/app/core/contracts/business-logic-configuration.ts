export class BusinessLogicConfiguration {
  public static readonly MaxRateDifference: number = 365;
  public static readonly MaxRateDifferenceForWarning: number = 30;
}

export enum Roles {
  Admin = 'Admin',
  Accountant = "Accountant",
  Reviewer = "Reviewer"
}
