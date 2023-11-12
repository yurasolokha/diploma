import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-new-card',
  templateUrl: './add-new-card.component.html',
  styleUrls: ['./add-new-card.component.scss']
})
export class AddNewCardComponent {
  @Output('onClick') onClick = new EventEmitter<any>();
}
