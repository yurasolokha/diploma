import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  TrackByFunction,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { AbstractControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import {
  FlatRowNode,
  RowNode,
  RowNodeType,
} from '../../component-models/row.model';
import { RowMapper } from '../../component-models/mappers/tree-node.mapper';
import { TemplateNameDirective } from '../../directives/template-name.directive';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-custom-tree-select',
  templateUrl: './custom-tree-select.component.html',
  styleUrls: ['./custom-tree-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTreeSelectComponent
  implements OnInit, OnChanges, AfterContentInit
{
  @Input() data!: any[];
  @Input() multiple: boolean = true;
  @Input() allowItemAsFolder: boolean = false;
  @Input('folderSplitter') folderSplitter = '/';

  @Input() selected!: any;
  @Output() selectedChange = new EventEmitter<any>();

  @ContentChildren(TemplateNameDirective)
  templates!: QueryList<TemplateNameDirective>;
  public viewTemplates: any;

  public checklistSelection!: SelectionModel<FlatRowNode>;
  public selectedAsString: string = '';
  public columns: string[] = ['item', 'folder'];

  ngAfterContentInit(): void {
    this.viewTemplates = this.templates.reduce((acc: any, cur) => {
      acc[cur.appTemplateName] = cur.template;
      return acc;
    }, {});
  }

  ngOnInit(): void {
    this.setTreeData(this.data);

    this.checklistSelection = new SelectionModel<FlatRowNode>(this.multiple);

    this.checklistSelection.changed
      .pipe(untilDestroyed(this))
      .subscribe((e) => {
        const selectedItems = this.checklistSelection.selected
          .filter((e) => !!e.data?.id)
          .map((e) => e.data);

        this.selectedAsString = selectedItems.map((e) => e.name).join(', ');
      });

    this.onValueChange(this.selected);
  }

  onValueChange(value: any) {
    if (!value || (Array.isArray(value) && !value?.length)) {
      this.checklistSelection.clear();
      return;
    }

    let selectedNodes: FlatRowNode[] = [];
    if (Array.isArray(value)) {
      selectedNodes = this.treeControl.dataNodes.filter(
        (node) => !!node.data?.id && value.some((e) => e['id'] === node.data.id)
      );
    } else {
      let flatNode = this.treeControl.dataNodes.find(
        (node) => !!node.data?.id && value.id === node.data.id
      );
      if (!!flatNode) {
        selectedNodes.push(flatNode);
      }
    }
    const selected = this.checklistSelection.selected.filter(
      (node) => !!node.data?.id
    );

    if (
      selectedNodes.length === selected.length &&
      selectedNodes.every((node) => selected.some((sNode) => sNode == node))
    ) {
      return;
    }

    if (!selectedNodes.length) {
      return;
    }

    this.checklistSelection.clear();
    this.checklistSelection.select(...selectedNodes);
    if(this.multiple)
      this.updateFolderState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChanges = changes['data'];
    if (!!dataChanges && !dataChanges.isFirstChange()) {
      this.setTreeData(this.data);
    }
    const valueChanges = changes['selected'];
    if (!!valueChanges && !valueChanges.isFirstChange()) {
      this.onValueChange(valueChanges.currentValue);
    }
  }

  private _transformer = (node: RowNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);

    const flatNode = existingNode || {
      data: node.data,
      expandable: !!node.children.length,
      level: level,
      type: !!node.children.length ? RowNodeType.folder : RowNodeType.item,
    };

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);

    return flatNode;
  };

  public trackBy: TrackByFunction<FlatRowNode> = (
    _: number,
    node: FlatRowNode
  ): string => {
    return `${node.data['path']}-${node.data['name']}-${
      node.data['id'] ?? 'folder'
    }`;
  };

  private flatNodeMap = new Map<FlatRowNode, RowNode>();
  private nestedNodeMap = new Map<RowNode, FlatRowNode>();

  treeControl = new FlatTreeControl<FlatRowNode>(
    (node) => node.level,
    (node) => node.expandable,
    { trackBy: (dataNode) => this.trackBy(-1, dataNode) }
  );

  treeFlattener = new MatTreeFlattener<RowNode, FlatRowNode>(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatRowNode) => node.expandable;

  public setTreeData(data: any[]) {
    const treeData = RowMapper.transform(data);

    this.dataSource.data = treeData;

    treeData.filter(e => !!e.children?.length).map(e => this._transformer(e, 0)).forEach(e => {
      this.treeControl.expand(e);
    })
  }

  descendantsAllSelected(node: FlatRowNode): boolean {
    if (!this.treeControl?.dataNodes) return false;

    const descendants = this.treeControl.getDescendants(node).filter(child => !!child.data?.id)
    return descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
  }

  descendantsPartiallySelected(node: FlatRowNode): boolean {
    if (!this.treeControl?.dataNodes) return false;

    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  updateFolderState() {
    const folders = this.treeControl.dataNodes.filter(node => !node.data?.id);

    folders.forEach((folder) => {
      this.descendantsAllSelected(folder) ?
      this.checklistSelection.select(folder) :
      this.checklistSelection.deselect(folder);
    })
  }

  selectNode(node: FlatRowNode) {
    this.checklistSelection.toggle(node);
    if (this.multiple && !this.allowItemAsFolder) {
      const descendants = this.treeControl?.getDescendants(node);
      this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(...descendants)
        : this.checklistSelection.deselect(...descendants);
    }

    const selectedItems = this.checklistSelection.selected
      .filter((e) => !!e.data?.id)
      .map((e) => e.data);

    this.selectedChange.emit(this.multiple ? selectedItems : selectedItems[0]);

    this.updateFolderState();
  }
}
