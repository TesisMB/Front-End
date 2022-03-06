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
    public dialog: MatDialog) {

      
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
  const emergency = this.emergencyDisaster[i];
  
  if(emergency.alerts.alertDegree != 'Controlado' ){
    const modalRef = this.modalService.open(NgbdModalComponent,{  size: 'xl' });
    modalRef.componentInstance.emergencyDisaster = emergency;
  }
}

openDialog(i){
  const emergency = this.emergencyDisaster[i];
  const dialogRef = this.dialog.open(NgbdEditDialogComponent);
  dialogRef.componentInstance.emergencyDisaster = emergency;
}

deletEmergencyDisaster(id : number){

  console.log("EmergencyDisasterId - Delete =>", id);
  
  this.emergencyDisasterService.deleteEmergencyDisaster(id).subscribe(data =>{
/*     this.getEmergencyDisaster();
 */    console.log("EmergencyDisaster - Deleted");
  }, error =>{
    console.log("Error - EmergencyDisaster - Deleted ", error);
  })
}

deleteModal(i, reason: string){
  const emergency = this.emergencyDisaster[i];
  const dialogRef = this.modalService.open(NgbdDeleteModalComponent, { centered: true });
  dialogRef.componentInstance.emergencyDisaster = emergency;
  dialogRef.componentInstance.titulo = reason;
}

}