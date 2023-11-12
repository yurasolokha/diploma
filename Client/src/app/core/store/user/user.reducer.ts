import { UserModel } from 'src/app/features/shared/models/user.model';
import { UserAction, UserActions } from './user.action';

export const userSelector = 'user';

const userInitialState: UserModel = {
  id: undefined,
  userName: 'Unauthorized User',
  firstName: 'unknown',
  lastName: 'unknown',
  middleName: 'unknown',
  email: 'unknown',
  roles: [{id: undefined, name: 'Anonymous'}],
  company: {id: undefined, name: 'NONE'},
  image: ''
};

export const userReducer = ( state: UserModel = userInitialState, action: UserActions) => {
  switch (action.type) {
    case UserAction.SetUser: return state = { ...action.user };
    case UserAction.RemoveUser: return state = { ...userInitialState };

    case UserAction.GetUser:
    default: return state;
  }
}