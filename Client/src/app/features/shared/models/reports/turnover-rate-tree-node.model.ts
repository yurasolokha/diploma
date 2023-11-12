import { TreeNode } from '../tree-node';

export class TurnoverRateNodeData{
  amount!: number;
  normalizedAmount!: number;
  generalNormalizedAmount!: number;
  parent!: TreeNode<TurnoverRateNodeData>;
}