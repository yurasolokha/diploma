import { DialogModel } from './dialog.model';

export class CreateUpdateDialogModel extends DialogModel {
  public isUpdate!: boolean;
  public initForm!: () => void;
}