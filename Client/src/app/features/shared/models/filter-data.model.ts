export type FilterDataModel = Omit<InteractableFilterDataModel, 'clickAction'>

export interface InteractableFilterDataModel{
  id: number;
  description: string;
  clickAction: (item:any) => void
}