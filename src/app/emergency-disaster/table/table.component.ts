import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { RequestTableService } from 'src/app/resources/request-table/request-table.service';
import { EmergencyDisasterService } from '../emergency-disaster.service';
import { NgbdDeleteModalComponent } from '../ngbd-delete-modal/ngbd-delete-modal.component';
import { NgbdEditDialogComponent } from '../ngbd-edit-dialog/ngbd-edit-dialog.component';
import { NgbdModalComponent } from '../ngbd-modal/ngbd-modal.component';
import { SelectTypesEmergencyDisasterService } from '../select-types-emergency-disaster.service';

@Component({
  selector: 'table-emergency-Disaster',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  emergencyDisaster: EmergencyDisaster[];
  emergencyDisasterObservable: Observable<EmergencyDisaster[]>;
  handler: any;
  array= [];
  typesid: number;
  types$: Observable<number>;
  loading$: Observable<boolean>;

  constructor(private emergencyDisasterService: EmergencyDisasterService,
    private selectTypesEmergencyDisasterService : SelectTypesEmergencyDisasterService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    public service: RequestTableService) {

      
    }
  ngOnInit(): void {
    this.loading$ = this.service.loading$;
    this.emergencyDisasterObservable = this.selectTypesEmergencyDisasterService.emergencyDisasterObservable$;
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
    console.log("EmergencyDisaster - Deleted");
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

