import { NgbdModalComponent } from '../ngbd-modal/ngbd-modal.component';
import { EmergencyDisasterService } from './../emergency-disaster.service';
import { Component, OnInit } from '@angular/core';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  emergencyDisaster: EmergencyDisaster [];
  handler: any;

  constructor(private emergencyDisasterService: EmergencyDisasterService,
    private modalService: NgbModal) {

     }

  ngOnInit(): void {
    this.getEmergencyDisaster();
  }

  getEmergencyDisaster() {
    this.emergencyDisasterService.getAll()
    .subscribe(data => {
      this.emergencyDisaster = data;
      //this.emergencyDisasterClone = JSON.parse(JSON.stringify(this.emergencyDisaster));
      //this.emergencyDisasterClone =  _.cloneDeep(this.emergencyDisaster);

      //this.emergencyDisaster = this.emergencyDisasterClone.filter(data => data.emergencyDisasterEndDate === null);
      //cargo el Observable con todos los datos que tengo
/*       this.emergencyDisasterService.SetEmergencyDisaster(data);
 */
      console.log('EmergencyDisaster - ListAll => ', data);
    }, error => {
      console.log('Error');
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

}
