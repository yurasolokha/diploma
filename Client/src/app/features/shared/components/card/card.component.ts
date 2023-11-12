import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardComponentModel } from '../../component-models/card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input('componentModel') componentModel!: CardComponentModel;
  @Output('contextmenu') contextMenu: EventEmitter<MouseEvent> = new EventEmitter();

  constructor() { }
}