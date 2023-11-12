import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClassifierModel } from 'src/app/features/shared/models/classifier.model';
import { OrderingModel } from 'src/app/features/shared/models/ordering.model';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';

@Injectable({ providedIn: 'root' })
export class ClassifiersService extends AbstractRestService {
  constructor(protected override http: HttpClient){ super(http); }

  public getClassifiers() {
    return this.get<ClassifierModel[]>('classifiers/classifiers');
  }

  public createClassifier(classifier: ClassifierModel){
    return this.putItem('classifiers/create-classifier', classifier);
  }

  public updateClassifier(classifier: ClassifierModel){
    return this.postItem('classifiers/update-classifier', classifier);
  }

  public updateClassifiersOrder(order: OrderingModel[]){
    return this.postItem('classifiers/update-classifiers-order', order);
  }

  public deleteClassifier(classifier: ClassifierModel) {
    return this.delete('classifiers/delete-classifier', classifier.id);
  }
}
