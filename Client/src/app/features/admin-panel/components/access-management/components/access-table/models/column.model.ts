import { Guid } from "src/app/utilities/types/guid";

export class Column {
  constructor(
    public readonly selector: Guid,
    public readonly title: ColumnTitle
  ) {}
}

export class ColumnTitle {
  constructor(
    public readonly primary: string,
    public readonly secondary: string | undefined = undefined
  ) {}
}
