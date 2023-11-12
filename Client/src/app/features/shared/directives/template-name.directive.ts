import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTemplateName]'
})
export class TemplateNameDirective {
  constructor(public readonly template: TemplateRef<any>) { }
  @Input('appTemplateName') appTemplateName!: string;
}
