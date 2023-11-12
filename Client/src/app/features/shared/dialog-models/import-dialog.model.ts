import { Observable } from "rxjs";
import { DialogModel } from "./dialog.model";
import { HttpEvent } from "@angular/common/http";

export class ImportDialogModel extends DialogModel {
    public fileExtensions!: string[];
    public uploadFile!: (file: File) => Observable<HttpEvent<Object>>
}
