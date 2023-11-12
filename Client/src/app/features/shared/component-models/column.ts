export class Column {
  constructor(
    public readonly selector: string, 
    public readonly displayName: string | undefined = undefined,
    public readonly folderSelector: string | undefined = undefined){
    if(!displayName) this.displayName = selector;
    if(!folderSelector) this.folderSelector = `folder-${selector}`;
  }
}