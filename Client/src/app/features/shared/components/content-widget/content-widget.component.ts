import { Component, Input } from '@angular/core';
import { ContentWidgetModel } from '../../component-models/content-widget';

@Component({
  selector: 'app-content-widget',
  templateUrl: './content-widget.component.html',
  styleUrls: ['./content-widget.component.scss']
})
export class ContentWidgetComponent {
  @Input('widgetModel') widgetModel!: ContentWidgetModel;

  constructor() { }
}
