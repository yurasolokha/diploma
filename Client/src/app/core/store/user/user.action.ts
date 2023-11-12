
import { Action } from '@ngrx/store';
import { UserModel } from 'src/app/features/shared/models/user.model';

export enum UserAction {
  GetUser = '[User] Get',
  SetUser = '[User] Set',
  RemoveUser = '[User] Remove',
}

export class GetUserAction implements Action {
  public readonly type = UserAction.GetUser;
}

export class SetUserAction implements Action {
  public readonly type = UserAction.SetUser;

  constructor(public user: UserModel) { }
}

export class RemoveUserAction implements Action {
  public readonly type = UserAction.RemoveUser;
}

export type UserActions = GetUserAction | SetUserAction | RemoveUserAction;
