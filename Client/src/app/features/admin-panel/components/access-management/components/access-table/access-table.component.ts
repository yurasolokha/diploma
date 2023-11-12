import { FlatTreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TrackByFunction,
} from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import {
  AccessLevel,
  AccessModel,
  UpdateAccessModel,
} from 'src/app/features/admin-panel/models/access.model';
import { AccessLevelMapper } from './mappers/access-level.mapper';
import { RowMapper } from '../../../../../shared/component-models/mappers/tree-node.mapper';
import { Column, ColumnTitle } from './models/column.model';
import {
  FlatRowNode,
  RowNode,
  RowNodeType,
} from '../../../../../shared/component-models/row.model';
import { Guid } from 'src/app/utilities/types/guid';
import { UserModel } from 'src/app/features/shared/models/user.model';
import { TreeSearchHelper } from 'src/app/utilities/helpers/tree-search.helper';

@Component({
  selector: 'app-access-table',
  templateUrl: './access-table.component.html',
  styleUrls: ['./access-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessTableComponent implements OnInit {
  @Input() data!: AccessModel[];
  @Input() users!: UserModel[];
  @Input() frozenColumns!: Column[];
  @Input() folderSplitter = '/';
  @Output() updateHandler = new EventEmitter<UpdateAccessModel[]>();

  public displayedColumns!: Column[];
  public columns!: Column[];
  public rows!: RowNode[];

  private transformer = (node: RowNode, level: number): FlatRowNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      data: node.data,
      level: level,
    };
  };

  public trackBy: TrackByFunction<FlatRowNode> = (
    _: number,
    node: FlatRowNode
  ): string => {
    return `${node.data['path']}-${node.data['name']}-${
      node.data['id'] ?? 'folder'
    }`;
  };

  treeControl = new FlatTreeControl<FlatRowNode>(
    (node) => node.level,
    (node) => node.expandable,
    { trackBy: (dataNode) => this.trackBy(-1, dataNode) }
  );

  treeFlattener = new MatTreeFlattener<RowNode, FlatRowNode>(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {}

  ngOnInit(): void {
    this.columns = this.createUserColumns(this.users);

    this.displayedColumns = [...this.frozenColumns, ...this.columns];

    if (!this.data) return;

    const rowNodes = RowMapper.transform(this.data, this.folderSplitter);
    this.dataSource.data = rowNodes;

    // this.treeControl.expandAll()

    this.expandNodes(rowNodes);
  }

  ngOnChanges(): void {
    if (!this.data || !this.columns) return;

    const rowNodes = RowMapper.transform(this.data, this.folderSplitter);

    this.dataSource.data = rowNodes;
  }

  private createUserColumns(users: UserModel[]): Column[] {
    return users.map(
      (user) =>
        new Column(
          user.id?.toString() ?? '',
          new ColumnTitle(user.firstName, user.lastName)
        )
    );
  }

  private expandNodes(rowNodes: RowNode<any>[]): void {

    rowNodes.filter(e => !!e.children?.length).map(e => this.transformer(e, 0)).forEach(e => {
      this.treeControl.expand(e);
    })
  }

  public getUserStatus(node: FlatRowNode, userId: Guid): AccessLevel {
    return (
      (node.data as AccessModel).accesses[userId.toString()] ??
      AccessLevel.Restricted
    );
  }

  public getColumnsSelectors(columns: Column[]): Guid[] {
    return columns.map((e) => e.selector);
  }

  public accessLevelToBoolean(accessLevel: AccessLevel): boolean {
    return AccessLevelMapper.accessLevelToBoolean(accessLevel);
  }

  public isFolder(node: FlatRowNode): boolean {
    return node.type === RowNodeType.folder || node.expandable;
  }

  public userAccessLevelChange(
    node: FlatRowNode,
    userId: Guid,
    checked: boolean
  ): void {
    const nodesToUpdate: FlatRowNode[] = [];

    if (this.isFolder(node))
      this.getChildNodesByType(node, nodesToUpdate, RowNodeType.item);

    nodesToUpdate.push(node);

    const dataToUpdate = nodesToUpdate
      .map<UpdateAccessModel>((e) => {
        return {
          accessId: e.data.id,
          userId: userId,
          accessLevel: AccessLevelMapper.booleanToAccessLevel(checked),
        };
      })
      .filter((e) => !!e.accessId);

    this.updateHandler.emit(dataToUpdate);
  }

  public descendantsPartiallySelected(
    node: FlatRowNode,
    userId: Guid
  ): boolean {
    const childs: FlatRowNode[] = [];
    this.getChildNodesByType(node, childs, RowNodeType.item);

    let isPartial = childs.some((e) => {
      return AccessLevelMapper.accessLevelToBoolean(
        this.getUserStatus(e, userId)
      );
    });

    return isPartial && !this.isNodesSelected(childs, userId);
  }

  public descendantsAllSelected(node: FlatRowNode, userId: Guid): boolean {
    const childs: FlatRowNode[] = [];
    this.getChildNodesByType(node, childs, RowNodeType.item);

    return this.isNodesSelected(childs, userId);
  }

  private isNodesSelected(nodes: FlatRowNode[], userId: Guid): boolean {
    return nodes.every((e) => {
      return AccessLevelMapper.accessLevelToBoolean(
        this.getUserStatus(e, userId)
      );
    });
  }

  private getChildNodesByType(
    node: FlatRowNode,
    items: FlatRowNode[],
    itemType: RowNodeType,
    folderType: RowNodeType = RowNodeType.folder
  ): void {
    const descendants = this.treeControl.getDescendants(node);
    items.push(
      ...descendants.filter((e) => e.type === itemType || !!e.data.id)
    );

    descendants
      .filter((e) => e.type === folderType)
      .forEach((e) => {
        this.getChildNodesByType(e, items, itemType, folderType);
      });
  }
}
