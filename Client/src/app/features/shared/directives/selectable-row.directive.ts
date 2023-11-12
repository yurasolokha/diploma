import { AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output, Renderer2 } from '@angular/core';

@Directive({ selector: '[selectableRow]' })
export class SelectableRowDirective implements AfterViewInit, OnDestroy {
  private rows!: HTMLElement[];
  private table: HTMLElement;

  private subscriptions: (() => void) [] = [];
  private moveSubscriptions: (() => void) [] = [];

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.table = this.el.nativeElement;
  }

  ngAfterViewInit(): void {
    this.observer = new MutationObserver(() => this.initView());
    this.initView();
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
    this.subscriptions.forEach(unsubscribe => { unsubscribe(); });
    this.moveSubscriptions.forEach(unsubscribe => { unsubscribe(); });
  }

  private observer!: MutationObserver;
  private isSelecting!: boolean;
  private selectedRow: HTMLElement | undefined;

  private initView(){
    this.observer.disconnect();

    const body = this.table.childNodes[1] as any;

    this.subscriptions.push(this.renderer.listen(body, "mouseup", (e) => this.unsubscribeMouseMove()));
    this.subscriptions.push(this.renderer.listen(body, "mousedown", (e) => this.subscribeMouseMove()));

    this.rows = Array.from(body.children);

    this.rows.forEach(row => {
      this.subscriptions.push(this.renderer.listen(row, "mouseup", (e) => this.rememberRow(e, row)));
      this.subscriptions.push(this.renderer.listen(row, "mousedown", (e) => this.selectRowRange(e, row)));
      this.renderer.setStyle(row, 'user-select', 'none');
    });

    this.subscriptions.push(this.renderer.listen(body, "mousedown", (e) => this.clearSelection(e)));

    this.observer.observe(this.table, { attributes: false, childList: true, subtree: true });
  }

  private clearSelection(event: any) {
    if(this.isSelecting) {this.isSelecting = false; return;}
    if(event.ctrlKey || event.shiftKey) return;
    if(event.button === 2 && Array.from(event.target.parentNode.classList).some(e => e === 'selected')) return;

    this.rows.forEach(row => { this.renderer.removeClass(row, "selected"); });
  }

  private rememberRow(event: MouseEvent, row: any) {
    this.renderer.addClass(row, "selected");
    this.selectedRow = row;
  }

  private selectRowRange(event: MouseEvent, row: any) {
    if(!this.selectedRow || !event.shiftKey) return;
    
    const row1 = this.rows.indexOf(this.selectedRow);
    const row2 = this.rows.indexOf(row);

    const index1 = row1 < row2 ? row1 : row2;
    const index2 = row1 > row2 ? row1 : row2;

    for(let i = index1; i <= index2; i++) this.renderer.addClass(this.rows[i], "selected");

    this.isSelecting = true;
    this.selectedRow = undefined;
  }

  private subscribeMouseMove(){
    this.rows.forEach(row => {
      this.moveSubscriptions.push(this.renderer.listen(row, "mouseover", (e) => this.rememberRow(e, row)));
    });
  }

  private unsubscribeMouseMove(){
    this.moveSubscriptions.forEach(unsubscribe => { unsubscribe(); });
    this.moveSubscriptions = [];
  }
}
