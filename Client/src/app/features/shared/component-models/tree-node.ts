export class TreeNode {
  public folderData?: any = undefined;
  public parentArray?: TreeNode[];

  constructor(
    public type: TreeNodeType,
    public item: any = undefined,
    public children: TreeNode[] = [],
    public path: string = '',
  ) { }
}

export class TreeFlatNode {
  constructor(
    public type: TreeNodeType,
    public item: any,
    public expandable: boolean,
    public level: number,
    public folderData?: any,
    public path?: string,){ }
}

export enum TreeNodeType {
  folder = 1,
  newFolder = 2,
  item = 3,
}
