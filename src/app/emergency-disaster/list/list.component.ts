import { Router } from '@angular/router';
import { SelectTypesEmergencyDisasterService } from './../select-types-emergency-disaster.service';
import { NgbdModalComponent } from '../ngbd-modal/ngbd-modal.component';
import { EmergencyDisasterService } from './../emergency-disaster.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, filter } from 'rxjs/operators';
import { pipe, Observable } from 'rxjs';
import * as _ from 'lodash';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgbdEditDialogComponent } from '../ngbd-edit-dialog/ngbd-edit-dialog.component';
import { NgbdDeleteModalComponent } from '../ngbd-delete-modal/ngbd-delete-modal.component';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  emergencyDisaster: EmergencyDisaster[];
  emergencyDisasterObservable: Observable<EmergencyDisaster[]>;
  handler: any;
  array= [];
  typesid: number;
  types$: Observable<number>;



  constructor(private emergencyDisasterService: EmergencyDisasterService,
    private selectTypesEmergencyDisasterService : SelectTypesEmergencyDisasterService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private router: Router) {

      
    }
    
    ngOnInit(): void {
    this.emergencyDisasterObservable = this.selectTypesEmergencyDisasterService.emergencyDisasterObservable$;
      
     /*  this.selectTypesEmergencyDisasterService.TypesEvent.subscribe(data =>{
        this.typesid = data;
        this.emergencyDisaster = this.selectTypesEmergencyDisasterService.filterTypes(this.emergencyDisasterClone);
      }) 

      this.selectTypesEmergencyDisasterService.TypesEventBoolean.subscribe(data =>{
        this.emergencyDisaster = this.selectTypesEmergencyDisasterService.status(this.emergencyDisasterClone);
      })  */

  }



getCardColor(state: string){
  if(state === 'Extremo'){
    return '#FADBD8';
  }
  else if(state === 'Moderado'){
    return '#FCF3CF';
  }
  else{
    return '#D5F5E3';

    }
}


openVerticallyCentered(i) {
  //FALTA CONTROLAR LA CARD VERDE QUE NO SEA ABRA

    const modalRef = this.modalService.open(NgbdModalComponent,{  size: 'xl' });
    modalRef.componentInstance.emergencyDisaster = this.selectTypesEmergencyDisasterService.emergencyDisasterObservableValue$[i];
}

deployment(){
  this.router.navigate(['emergencias/detalles']);
}

openDialog(i){

  const emergency = this.emergencyDisasterObservable[i];
  const dialogRef = this.dialog.open(NgbdEditDialogComponent);
  dialogRef.componentInstance.emergencyDisaster = this.selectTypesEmergencyDisasterService.emergencyDisasterObservableValue$[i];
}



deleteModal(i, reason: string){
  const emergency = this.emergencyDisasterObservable[i];
  const dialogRef = this.modalService.open(NgbdDeleteModalComponent, { centered: true });
  dialogRef.componentInstance.emergencyDisaster = this.selectTypesEmergencyDisasterService.emergencyDisasterObservableValue$[i];
  dialogRef.componentInstance.titulo = reason;
}

}