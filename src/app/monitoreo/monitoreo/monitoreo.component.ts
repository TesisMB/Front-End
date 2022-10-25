import { DialogPDFComponent } from './../dialog-pdf/dialog-pdf.component';
import { AlertService } from './../../services/_alert.service/alert.service';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { MonitoreoService } from '../monitoreo.service';
import { Files } from 'src/app/models/monitoreos';
@Component({
  selector: 'monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css']
})
export class MonitoreoComponent implements OnInit {
data: any[] = [];
handle: Subscription;
isLoading = true;
files$: Observable<Files[]>;
  constructor(
    private alertService: AlertService,
    private service: MonitoreoService,
    public dialog: MatDialog) { 

      this.files$ = this.service.files$;
  }


  ngOnInit(): void {
      this.getAll();
  }


  openDialog() {
  let dialogRef =  this.dialog.open(DialogPDFComponent, {
      height: '400px',
      width: '600px',
      data: { file: this.data, isEdit: false },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog close => ', result);
      if(result){this.getAll()}
    });
  }

  getAll(){
  this.handle =  this.service.getAll()
              .subscribe(
                (data) => {
                  this.data = data;
                  localStorage.setItem('pdfs',JSON.stringify(data));
                  this.service.addPDF(data);
                  this.isLoading = false;
                }
                ,
                (err) =>{ 
                  this.alertService.error('Ha ocurrido un error, vuelva a intentarlo mas tarde', {autoClose: true});
                  this.isLoading = false;
              });
  }
}
