import { Directive, ElementRef, EventEmitter, OnDestroy, Output, Renderer2 } from '@angular/core';

@Directive({ selector: '[resizableColumn]' })
export class ResizableColumnDirective implements OnDestroy {
  @Output("resizableColumn") onResize = new EventEmitter<{newWidth: number}>();

  private column: HTMLElement;
  private table!: HTMLElement;

  private subscriptions: (() => void) [] = [];

  constructor(private element: ElementRef, private renderer: Renderer2,) { 
    this.column = this.element.nativeElement;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(unsubscribe => {
      unsubscribe();
    });
  }

  ngOnInit() {
    let resizer = this.renderer.createElement('div');

    this.renderer.setStyle(resizer, 'background', 'transparent');
    this.renderer.setStyle(resizer, 'cursor', 'col-resize');
    this.renderer.setStyle(resizer, 'position', 'relative');
    this.renderer.setStyle(resizer, 'width', '10px');
    this.renderer.setStyle(resizer, 'height', '25px');
    this.renderer.setStyle(resizer, 'right', '-5px');
    this.renderer.setStyle(resizer, 'margin-left', 'auto');
    this.renderer.setStyle(resizer, 'margin-top', '-20px');

    this.renderer.appendChild(this.column, resizer);
    
    const row = this.renderer.parentNode(this.column);
    const thead = this.renderer.parentNode(row);
    this.table = this.renderer.parentNode(thead);

    this.subscriptions.push(this.renderer.listen(resizer, "mousedown", (e) => this.onMouseDown(e)));
    this.subscriptions.push(this.renderer.listen("body", "mousemove", (e) => this.onMouseMove(e)));
    this.subscriptions.push(this.renderer.listen("document", "mouseup", (e) => this.onMouseUp(e)));
  }

  private startPoint!: number;
  private startColWidth!: number;
  private startTableWidth!: number;
  private isResizing!: boolean;

  onMouseDown(event: MouseEvent) {
    this.isResizing = true;
    this.startPoint = event.pageX;
    this.startColWidth = this.column.offsetWidth;
    this.startTableWidth = this.table.offsetWidth;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isResizing || !event.buttons) return;

    const offset = 10;

    let colWidth = this.startColWidth + (event.pageX - this.startPoint - offset);

    if(colWidth < 10) return;

    let tabWidth = this.startTableWidth + (event.pageX - this.startPoint - offset);

    this.renderer.setStyle(this.table, "width", `${tabWidth}px`);
    this.renderer.setStyle(this.column, "width", `${colWidth}px`);
  }
  
  onMouseUp(event: MouseEvent) {
    if(this.isResizing) this.isResizing = false;
  }
}