export class GroupByItem<TKey, TItem, TValues>{
  key!: TKey;
  keyItem!: TItem;
  values!: TValues[];
}