import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-drop-file',
  templateUrl: './drop-file.component.html',
  styleUrls: ['./drop-file.component.scss']
})
export class DropFileComponent {
  @Input() allowedTypes!: string[];

  @Output() onFileDropped = new EventEmitter<any>();
  
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('container') container!: any;
  
  constructor() { }

  openChoosingFileDialog(){ this.fileInput?.nativeElement?.click(); }

  handleError(error: any){
    console.log(error);
  }

  selectFile(event: any){ 
    const file = this.getFileFrom(event);

    if(!file) {
      this.container.nativeElement.classList.add('file-error');
      return;
    }

    this.onFileDropped.emit(file);
  }

  private getFileFrom(event: any){
    let files: any[] = Array.from(event.target.files);

    if (!files.length) return undefined; 

    if(!this.allowedTypes) return files[0];

    return files.find(f => this.allowedTypes!.some(afe => afe === this.fileExtension(f.name)));
  }

  private fileExtension(fileName:string){
    return fileName.substring(fileName.lastIndexOf('.') , fileName.length);
  }
}