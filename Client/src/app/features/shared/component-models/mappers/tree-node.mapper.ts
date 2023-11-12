import { AccessModel } from 'src/app/features/admin-panel/models/access.model';
import { RowNode, RowNodeType } from '../row.model';
import { Column } from '../../../admin-panel/components/access-management/components/access-table/models/column.model';

export class RowMapper {
  public static transform(data: any[], pathSplitter: string = '/'): RowNode[] {
    const res = this.transformData(data, pathSplitter);

    return res;
  }

  private static transformData(data: any[], pathSplitter: string): RowNode[] {
    const rows: RowNode[] = [];

    data.forEach((element: any) => {
      const folders = element.path.split(pathSplitter);
      const folderChildArray = this.folderNode(folders, rows);

      const folderIsItem = folderChildArray.find(
        (e) => e.data.name === element.name
      );
      if (!!folderIsItem) {
        folderIsItem.data = element;
        return;
      }

      const itemNode = new RowNode(element);
      folderChildArray.unshift(itemNode);
    });

    return rows;
  }

  private static folderNode(
    folders: string[],
    rows: RowNode[],
    index = 0
  ): RowNode[] {
    if (!!folders && folders.every((e) => !e)) return rows;

    let node = rows.find((e) => e.data.name === folders[index]);

    if (!node) {
      node = new RowNode(
        {
          name: folders[index],
          path: folders.slice(0, index).join('/'),
        },
        []
      );
      rows.push(node);
    }

    if (!folders[index + 1]) {
      return node.children;
    }

    return this.folderNode(folders, node.children, index + 1);
  }
}
