import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({ selector: '[appDropFile]' })
export class DropFileDirective {
  @Input('allowedTypes') allowedTypes!: string[];

  @Output('onError') onError = new EventEmitter<string>();
  @Output('onFileDropped') onFileDropped = new EventEmitter<any>();

  @HostBinding('class.file-over') fileOver?: boolean;
  @HostBinding('class.file-error') fileError?: boolean;

  constructor() { }

  @HostListener('dragover', ['$event'])
  whenDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();

    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event'])
  whenDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();

    this.fileOver = false;
  }

  @HostListener('drop', ['$event'])
  whenDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();

    this.fileOver = this.fileError = false;

    let file = this.getFile(e);

    if(!file){
      this.fileError = true;
      this.onError.emit('The file has wrong format!');

      return;
    }

    this.onFileDropped.emit(file);
  }

  private getFile(e: any){
    let files: any[] = Array.from(e.dataTransfer.files);

    if (!files.length) return undefined; 

    if(!this.allowedTypes) return files[0];

    return files.find(f => this.allowedTypes!.some(afe => afe === this.fileExtension(f.name)));
  }

  private fileExtension(fileName:string){
    return fileName.substring(fileName.lastIndexOf('.') , fileName.length);
  }
}