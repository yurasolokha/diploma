import { AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output, Renderer2 } from '@angular/core';

@Directive({ selector: '[draggableColumns]' })
export class DraggableColumnDirective  implements AfterViewInit, OnDestroy {
  @Output("draggableColumns") onSwapColumns = new EventEmitter<{first: number, second: number}>();

  private table: HTMLElement;
  private subscriptions: (() => void) [] = [];

  constructor(private element: ElementRef, private renderer: Renderer2) { 
    this.table = this.element.nativeElement;
  }

  private observer!: MutationObserver;

  ngAfterViewInit(): void {
    this.observer = new MutationObserver(() => this.initView());

    this.initView();
  }

  ngOnDestroy(): void {
    this.observer.disconnect();

    this.subscriptions.forEach(unsubscribe => { unsubscribe(); });
  }

  private initView(){
    this.observer.disconnect();

    Array.from(this.table.children[0].children[0].children).forEach((col, i) =>{
      if(Array.from(col.children).some(e => e.id === 'resizer')) return;

      const holder = this.renderer.createElement('div');

      holder.id = 'resizer';
      
      this.renderer.setAttribute(holder, 'draggable', 'true');

      this.renderer.setStyle(holder, 'position', 'relative');
      this.renderer.setStyle(holder, 'height', '20px');
      this.renderer.setStyle(holder, 'background-color', 'transparent');
      this.renderer.setStyle(holder, 'margin-top', '-25px');
      this.renderer.setStyle(holder, 'margin-right', '20px');
      this.renderer.setStyle(holder, 'margin-left', '20px');
      
      this.subscriptions.push(this.renderer.listen(holder, "dragstart", () => this.onMouseDown(i)));
      this.subscriptions.push(this.renderer.listen(holder, "drop", () => this.onDrop(col, i)));
      this.subscriptions.push(this.renderer.listen(holder, "dragover", (ev) => this.onOver(ev, col)));
      this.subscriptions.push(this.renderer.listen(holder, "dragleave", (ev) => this.onLeave(col)));

      this.renderer.appendChild(col, holder);
    });

    this.observer.observe(this.table, { attributes: false, childList: true, subtree: true });
  }

  private columnIndex!: number;

  private onMouseDown = (col: any) => {
    this.columnIndex = col;
  }

  private onDrop = (col: any, i: any) => {
    this.swapColumns(i);
    this.renderer.removeClass(col, 'over');
  }

  private swapColumns = (col: any) => {
    this.onSwapColumns.emit({first: this.columnIndex, second: col});
  }

  private onOver(ev: any, col: any){
    ev.preventDefault();
    this.renderer.addClass(col, 'over');
  }

  private onLeave(col: any){
    this.renderer.removeClass(col, 'over');
  }
}
