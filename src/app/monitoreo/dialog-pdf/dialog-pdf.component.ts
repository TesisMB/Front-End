import { EmergencyDisasterService } from 'src/app/emergency-disaster/emergency-disaster.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from './../../services/_alert.service/alert.service';
import { MonitoreoService } from './../monitoreo.service';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Observable, pipe, Subscription } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AlertArray, AlertsInput } from 'src/app/models/emergencyDisaster';
import { Files } from 'src/app/models/monitoreos';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface EditMode {
  file: Files,
  isEdit: boolean
}

@Component({
  selector: 'dialog-pdf',
  templateUrl: './dialog-pdf.component.html',
  styleUrls: ['./dialog-pdf.component.css']
})
export class DialogPDFComponent implements OnInit {
  emergencyControl = new FormControl();
  emergencyGroups: AlertsInput[] = [];
  
  title = 'Carga de documentos';
  isLoading = true;
  selectedFiles?: FileList;
  selectedFileNames: string= "";
  progressInfos: any[] = [];
  message: string = "";
  previews: string = "";
  imageInfos?: Observable<any>;
  form: FormGroup;
  handleEmergency: Subscription;
  handle: Subscription;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EditMode,
    public dialogRef: MatDialogRef<DialogPDFComponent>,
    private service: MonitoreoService,
    private alertService: AlertService,
    public formBuilder: FormBuilder,
    private emergenciesService: EmergencyDisasterService) { }

  ngOnInit(): void {
    this.getEmergencies();

    this.form = this.formBuilder.group({
      location:['',[Validators.required]],
      // createdBy:['', Validators.required],
      Fk_EmergencyDisasterID: ['', Validators.required],
      // ModifiedBy : ['', Validators.required]
    });

    if(this.data.file && this.data.isEdit){
      this.title = 'Modificar documentación'
      this.location.patchValue(this.data.file.location);
      this.alertID.patchValue(this.data.file.emergenciesDisasters.emergencyDisasterID);
    }
  }

  
public get f() {
  return this.form;
}
public get location(){
  return this.form.get('location');
}
public get alertID(){
  return this.form.get('Fk_EmergencyDisasterID');
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
            const msg = 'Se cargó el archivo exitosamente!: ' + file.name;
            this.message = msg;
            this.imageInfos = this.service.getFiles(file.name);
            console.log('Recibido => ', event);
            this.location.patchValue(event.body);
           }
        (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'No se ha podido cargar el archivo: ' + file.name;
          this.message = msg;
        } });
    }
  }

  getEmergencies(){
    this.handleEmergency = this.emergenciesService.getAlerts()
    .subscribe(data =>{
      console.log('data => ',data);
      this.emergencyGroups = data;
      this.isLoading = false;
    },
    (err) => {
    this.isLoading = false;

    } );
  }

  onSubmit(){
    if(this.form.valid){
      const pdf = this.form.value;
      this.isLoading = true;
      this.handle = this.service.register(pdf)
      .subscribe(
        (resp) => {
          this.isLoading = false;
          this.alertService.success('Documento subido exitosamente!');
          this.closeDialog(pdf);
          this.service.setMonitoreo(pdf);
          console.log(resp);
        },
      (err) => {
        this.isLoading = false;
        console.log(err);
        this.closeDialog(pdf);

      }
      );
    }
    else {
    }
  }

  closeDialog(value) {
    this.dialogRef.close(value);
  }
}
