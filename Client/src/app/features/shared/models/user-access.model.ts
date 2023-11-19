import {Guid} from "../../../utilities/types/guid";
import {AccessLevel} from "../../admin-panel/models/access.model";

export class UserAccessModel{
  public userId!: Guid;
  public userFirstName!: string;
  public userLastName!: string;
  public userRole!: string;
  public accessLevel!: AccessLevel;
}

export class UserAccessValue{
  public userId!: Guid;
  public accessLevel!: AccessLevel;
}
