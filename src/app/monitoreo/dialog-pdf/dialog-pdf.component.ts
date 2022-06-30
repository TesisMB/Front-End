import { AlertService } from './../../services/_alert.service/alert.service';
import { MonitoreoService } from './../monitoreo.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'dialog-pdf',
  templateUrl: './dialog-pdf.component.html',
  styleUrls: ['./dialog-pdf.component.css']
})
export class DialogPDFComponent implements OnInit {
  selectedFiles?: FileList;
  selectedFileNames: string= "";
  progressInfos: any[] = [];
  message: string = "";
  previews: string = "";
  imageInfos?: Observable<any>;
  
  constructor(private service: MonitoreoService, private alertService: AlertService) { }

  ngOnInit(): void {
  }

  selectFiles(event: any): void {
    this.message = "";
    this.progressInfos = [];
    this.selectedFileNames = "";
    this.selectedFiles = event.target.files;
  //  this.previews = "";
    if (this.selectedFiles && this.selectedFiles[0]) {
      
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews = e.target.result;
        };
        reader.readAsDataURL(this.selectedFiles[i]);
        this.selectedFileNames = this.selectedFiles[i].name;
      }
       this.uploadFiles();
    }
  }

  uploadFiles(): void {
    this.message = "";
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    if (file) {
      this.service.upload(file)
      .subscribe(
        (event: any) => {
         if (event.type === HttpEventType.UploadProgress) {
           this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
         } else if (event instanceof HttpResponse) {
            const msg = 'Se cargó la imagen exitosamente!: ' + file.name;
            this.message = msg;
            this.imageInfos = this.service.getFiles(file.name);
           }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'No se ha podido cargar la imagen: ' + file.name;
          this.message = msg;
        });
    }
  }
}
