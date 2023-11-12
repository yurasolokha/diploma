import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({ selector: '[appClickOutside]' })
export class ClickOutsideDirective {
  @Output() appClickOutside: EventEmitter<MouseEvent> = new EventEmitter();
  @Input() classToCheck?: string;

  @HostListener('document:mousedown', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target) &&
      (!this.classToCheck || (event as any).path?.every((e: any) => e.classList?.includes && !e.classList.includes(this.classToCheck)))) {
      this.appClickOutside.emit(event);
    }
  }

  constructor(private elementRef: ElementRef) { }
}
