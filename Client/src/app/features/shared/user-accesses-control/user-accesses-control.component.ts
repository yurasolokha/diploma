import {Component} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {UserAccessModel} from "../models/user-access.model";
import {MatSelectionListChange} from "@angular/material/list";
import {Guid} from "../../../utilities/types/guid";
import {AccessLevel} from "../../admin-panel/models/access.model";
import {Roles} from "../../../core/contracts/business-logic-configuration";

@Component({
  selector: 'app-user-accesses-control',
  templateUrl: './user-accesses-control.component.html',
  styleUrls: ['./user-accesses-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: UserAccessesControlComponent
    }
  ]
})
export class UserAccessesControlComponent implements ControlValueAccessor{

  userAccesses : UserAccessModel[] = [];

  onChange = (userAccesses: UserAccessModel[]) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(userAccessModels: UserAccessModel[]): void {
    this.userAccesses = userAccessModels;
  }

  selectionChanged(event: MatSelectionListChange): void {
    this.markAsTouched();
    const changedUserAccessId = event.options[0].value as Guid;
    const isSelected = event.options[0].selected;
    const userAccessToChange =  this.userAccesses.find(a=>a.userId === changedUserAccessId);
    if(userAccessToChange){
      if(isSelected) userAccessToChange.accessLevel = AccessLevel.Full;
      else userAccessToChange.accessLevel = AccessLevel.Restricted;
      this.onChange(this.userAccesses);
    }
  }

  isSelected(id: Guid) : boolean {
    return this.userAccesses.find(u=>u.userId === id)?.accessLevel === AccessLevel.Full;
  }

  isDisabled(id:Guid) : boolean {
    const userRole = this.userAccesses.find(u=>u.userId === id)?.userRole;
    if(!userRole) return false;
    return  userRole === Roles.Admin;
  }

}
