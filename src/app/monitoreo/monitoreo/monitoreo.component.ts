import { DialogPDFComponent } from './../dialog-pdf/dialog-pdf.component';
import { AlertService } from './../../services/_alert.service/alert.service';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { MonitoreoService } from '../monitoreo.service';

@Component({
  selector: 'monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css']
})
export class MonitoreoComponent implements OnInit {
data: Subscription;
isLoading = true;
  constructor(
    private alertService: AlertService,
    private service: MonitoreoService,
    public dialog: MatDialog) { 

  }


  ngOnInit(): void {
     this.getAll();
  }

  openDialog() {
    this.dialog.open(DialogPDFComponent);
  }

  getAll(){
  this.data =  this.service.getAll()
              .subscribe(
                (data) => {
                  this.data = data;
                  this.isLoading = false;
                }
                ,
                (err) =>{ 
                  this.alertService.error('Ha ocurrido un error, vuelva a intentarlo mas tarde', {autoClose: true});
                  this.isLoading = false;
              });
  }
}
