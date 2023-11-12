export class RowNode<T = any> {
  constructor(public data: T, public children: RowNode<T>[] = []) {}
}

export interface FlatRowNode<T = any> {
  expandable: boolean;
  data: T;
  type?: RowNodeType;
  level: number;
}

export enum RowNodeType {
  folder = 'folder',
  item = 'item',
}
