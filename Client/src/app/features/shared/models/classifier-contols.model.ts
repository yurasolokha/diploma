import { FormControl } from '@angular/forms';
import { ClassifierModel } from './classifier.model';

export class ClassifierControl {
  constructor(
    public key: ClassifierModel,
    public name: string,
    public control: FormControl
  ){}
}