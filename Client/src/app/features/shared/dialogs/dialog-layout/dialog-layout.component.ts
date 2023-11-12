import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModel } from '../../dialog-models/dialog.model';

@Component({
  selector: 'app-dialog-layout',
  templateUrl: './dialog-layout.component.html',
  styleUrls: ['./dialog-layout.component.scss']
})
export class DialogLayoutComponent {
  @Input('model') model!: DialogModel;

  @Output('save') save: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('close') close: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }
}
