import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, Input, OnInit, QueryList, TrackByFunction, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Column } from '../../component-models/column';
import { TreeFlatNode, TreeNode, TreeNodeType } from '../../component-models/tree-node';
import { TemplateNameDirective } from '../../directives/template-name.directive';

@Component({
  selector: 'app-custom-tree',
  templateUrl: './custom-tree.component.html',
  styleUrls: ['./custom-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomTreeComponent implements OnInit, AfterContentInit {
  @Input('itemActions') itemActions: any = undefined;
  @Input('folderActions') folderActions: any = undefined;
  @Input('emptyActions') emptyActions: any = undefined;
  @Input('allowActions') allowActions: boolean = true;
  @Input('displayedColumns') displayedColumns: Column[] = [];
  @Input('data') set data(value: any[]) { setTimeout(() => this.setTreeData(value), 1 ); }

  @Input('itemSelector') itemSelector!: (item: any) => any;
  @Input('nameSelector') nameSelector?: (item: any) => string;
  @Input('folderSelector') folderSelector!: (item: any) => string;
  @Input('afterTreeCreated') afterTreeCreated!: (tree: TreeNode[]) => void;
  @Input('sort') sort!: (item1: any, item2: any) => number;

  @Input('displayHeader') displayHeader = true;
  @Input('folderSplitter') folderSplitter = '/';

  @Input('useCustomFolders') useCustomFolders = false;

  @ContentChildren(TemplateNameDirective) templates!: QueryList<TemplateNameDirective>;

  @ViewChild('itemValue')
  newFolderInput: ElementRef<HTMLInputElement> | undefined;

  public column!: any;
  public columns!: any[];
  public viewTemplates: any;

  constructor(
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  private _transformer = (node: TreeNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);

    if(existingNode){
      existingNode.type = node.type;
      existingNode.item = node.item;
      existingNode.path = node.path;
      existingNode.expandable = !!node.children.length;
      existingNode.folderData = node.folderData;
    }

    const flatNode = existingNode || new TreeFlatNode(node.type, node.item, !!node.children.length, level, node.folderData, node.path);

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);

    return flatNode;
  };

  private flatNodeMap = new Map<TreeFlatNode, TreeNode>();
  private nestedNodeMap = new Map<TreeNode, TreeFlatNode>();

  public treeControl = new FlatTreeControl<TreeFlatNode>(node => node.level, node => node.expandable);
  private treeFlattener = new MatTreeFlattener(this._transformer, (node: any) => node.level, (node: any) => node.expandable, (node: any) => node.children);
  public treeData = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  emptyFolder = (_: number, node: TreeFlatNode) => node.type === TreeNodeType.folder && !node.expandable;
  hasChild = (_: number, node: TreeFlatNode) => node.type === TreeNodeType.folder && node.expandable;
  folderCreating = (_: number, node: TreeFlatNode) => node.type === TreeNodeType.newFolder;
  isItem = (_: number, node: TreeFlatNode) => node.type === TreeNodeType.item;
  isNoData = () => !this.treeData.data.length;
  trackBy: TrackByFunction<TreeFlatNode> = (
    _: number,
    node: TreeFlatNode
  ): string => {
    return `${node.path}-${node.type != TreeNodeType.item ? node.item : node.item?.['name'] ?? 'name'}-${
      node.type != TreeNodeType.item ? node.type : node.item?.['id'] ?? 'id'
    }`;
  };

  ngAfterContentInit(): void {
    this.viewTemplates = this.templates.reduce((acc: any, cur) => {
      acc[cur.appTemplateName] = cur.template; return acc;
    }, {});
  }

  ngOnInit(): void {
    this.column = this.displayedColumns[0];
    this.columns = [...this.displayedColumns].splice(1);
  }

  ngAfterViewChecked(): void {
    if(!!this.newFolderInput) {
      this.newFolderInput.nativeElement.scrollIntoView({behavior: 'smooth'})
      this.newFolderInput.nativeElement.focus({preventScroll: true})
    }
  }
  public setTreeData(data: any[]) {
    if(this.sort) data.sort(this.sort);
    
    const treeData = this.transformData(data);

    if(this.afterTreeCreated) this.afterTreeCreated(treeData);

    this.treeData.data = treeData;

    treeData.filter(e => !!e.children?.length).map(e => this._transformer(e, 0)).forEach(e => {
      this.treeControl.expand(e);
    })

    this.cdr.detectChanges();
  }

  public addFolder(flatNode: TreeFlatNode) {
    const node = this.flatNodeMap.get(flatNode)!;
    const path = node.path + node.item + this.folderSplitter;

    const newNode = new TreeNode(TreeNodeType.newFolder, '', [], path);

    newNode.parentArray = node.children;

    node.children.push(newNode);

    this.treeData.data = this.treeData.data;
  }

  public addRootFolder() {
    const path = '';

    const newNode = new TreeNode(TreeNodeType.newFolder, '', [], path);

    newNode.parentArray = this.treeData.data;

    this.treeData.data.push(newNode);

    this.treeData.data = this.treeData.data;
  }

  saveFolder(flatNode: TreeFlatNode, itemValue: any){
    const node = this.flatNodeMap.get(flatNode)!;

    if(!itemValue){
      node.parentArray!.splice(node.parentArray!.indexOf(node), 1);

      this.treeData.data = this.treeData.data;
      
      return;
    }

    node.type = TreeNodeType.folder;
    node.item = itemValue;
    node.folderData = {};

    this.treeData.data = this.treeData.data;

    if(this.afterTreeCreated) this.afterTreeCreated(this.treeData.data);
  }

  private transformData(data: any[]): TreeNode[] {
    const treeData: TreeNode[] = [];

    data.forEach(element => {
      const folders = this.folderSelector(element).split(this.folderSplitter);
      const itemNode = new TreeNode(TreeNodeType.item, this.itemSelector(element));

      itemNode.path = this.folderSelector(element);

      if(!folders[0]) { // root item
        if(this.nameSelector){
          this.pushInstead(itemNode, treeData);
        }
        return;
      }

      const folderNode = this.folderNode(folders, treeData);

      itemNode.parentArray = folderNode.children;

      if(this.nameSelector) this.pushInstead(itemNode, folderNode.children);
      else folderNode.children.push(itemNode);
    });

    return treeData;
  }

  private pushInstead(itemNode: TreeNode, nodes: TreeNode[]) {
    const isFolder = nodes.find(e => typeof e.item === 'string' && this.nameSelector!(itemNode.item) === e.item);

    if(isFolder){
      isFolder.item = itemNode.item;
      isFolder.type = itemNode.type;
    }
    else{
      nodes.push(itemNode);
    }
  }

  private folderNode(folders: string[], treeNodes: TreeNode[], index = 0): TreeNode {
    let node = treeNodes.find(e => e.type === TreeNodeType.folder && e.item === folders[index]);

    if(!node) {
      node = new TreeNode(TreeNodeType.folder, folders[index]);

      node.parentArray = treeNodes;
      node.path = folders.slice(0, index).join(this.folderSplitter) + this.folderSplitter;

      treeNodes.unshift(node);
    }

    if(folders.length === index || !folders[index+1]) return node;

    return this.folderNode(folders, node.children, index + 1);
  }

  public menuTopLeftPosition =  {x: '0', y: '0'}
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger!: MatMenuTrigger;
  onRightClick(event: MouseEvent, item: any, actions: any) {
    if(!actions || !actions.length) return;
    if(!this.allowActions) return;
    
    event.preventDefault();

    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';

    this.matMenuTrigger.menuData = { item: { actions: actions, data: item } }

    this.matMenuTrigger.openMenu();
  }
}
