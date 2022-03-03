import { SelectTypesEmergencyDisasterService } from './../select-types-emergency-disaster.service';
import { NgbdModalComponent } from '../ngbd-modal/ngbd-modal.component';
import { EmergencyDisasterService } from './../emergency-disaster.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, filter } from 'rxjs/operators';
import { pipe, Observable } from 'rxjs';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgbdEditDialogComponent } from '../ngbd-edit-dialog/ngbd-edit-dialog.component';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  emergencyDisaster: EmergencyDisaster[];
  emergencyDisasterClone: EmergencyDisaster[];
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
      this.getEmergencyDisaster();
      
      this.selectTypesEmergencyDisasterService.TypesEvent.subscribe(data =>{
        this.typesid = data;
        this.emergencyDisaster = this.selectTypesEmergencyDisasterService.filterTypes(this.emergencyDisasterClone);
      }) 

      this.selectTypesEmergencyDisasterService.TypesEventBoolean.subscribe(data =>{
        this.emergencyDisaster = this.selectTypesEmergencyDisasterService.status(this.emergencyDisasterClone);
      }) 

  }


  getEmergencyDisaster() {
    this.emergencyDisasterService.getAll()

        //Objetos
        /* const user = _.pick(
            (this.emergencyDisaster, ['']) */

         /*    const user = _.pick(
              x[0], ('emergencyDisasterID')
            ) */

    /*         console.log("User => ", user); */

    .subscribe(data => {

      
      this.emergencyDisaster = data;
      this.emergencyDisasterClone =  _.cloneDeep(this.emergencyDisaster);

      //this.emergencyDisasterClone = JSON.parse(JSON.stringify(this.emergencyDisaster));
      //this.emergencyDisasterClone =  _.cloneDeep(this.emergencyDisaster);
      
      //this.emergencyDisaster = this.emergencyDisasterClone.filter(data => data.emergencyDisasterEndDate === null);
      //cargo el Observable con todos los datos que tengo
      /*       this.emergencyDisasterService.SetEmergencyDisaster(data);
      */
     console.log('EmergencyDisaster - ListAll => ', data);
    }, error => {
      console.log('Error', error);
    })
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
    this.getEmergencyDisaster();
    console.log("EmergencyDisaster - Deleted");
  }, error =>{
    console.log("Error - EmergencyDisaster - Deleted ", error);
  })
}


}