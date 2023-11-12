import { AccessLevel } from 'src/app/features/admin-panel/models/access.model';

export class AccessLevelMapper {
  public static accessLevelToBoolean(accessLevel: AccessLevel) {
    return accessLevel === AccessLevel.Full;
  }

  public static booleanToAccessLevel(bool: boolean) {
    return bool ? AccessLevel.Full : AccessLevel.Restricted;
  }
}
