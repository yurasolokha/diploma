import { createFeatureSelector } from '@ngrx/store';
import { UserModel } from 'src/app/features/shared/models/user.model';
import { userSelector } from './user.reducer';

export const selectUserFeature = createFeatureSelector<UserModel>(userSelector);

