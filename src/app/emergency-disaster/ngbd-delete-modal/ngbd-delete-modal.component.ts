import { SelectTypesEmergencyDisasterService } from './../select-types-emergency-disaster.service';
import { AlertService } from './../../services/_alert.service/alert.service';
import { EmergencyDisasterService } from './../emergency-disaster.service';
import { EmergencyDisaster } from './../../models/emergencyDisaster';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-delete-modal',
  templateUrl: './ngbd-delete-modal.component.html',
  styleUrls: ['./ngbd-delete-modal.component.css']
})
export class NgbdDeleteModalComponent implements OnInit {

  @Input() emergencyDisaster: EmergencyDisaster;
  
  titulo: string;

  constructor(public modal: NgbActiveModal,
              private emergencyDisasterService: EmergencyDisasterService,
              private alertService: AlertService,
              private selectTypesEmergencyDisasterService: SelectTypesEmergencyDisasterService){}
              ngOnInit(): void {
  }


  deletEmergencyDisaster(id : number){
    this.emergencyDisasterService.deleteEmergencyDisaster(id).subscribe(data =>{
      this.alertService.success('Emergencia eliminada exitosamente', { autoClose: true });
      this.selectTypesEmergencyDisasterService.deleteFromTable(id);
      this.modal.close();
      console.log("EmergencyDisaster - Deleted", data);
    }, error =>{
      this.alertService.warn('Ha ocurrido un error', { autoClose: true });
      console.log("Error - EmergencyDisaster - Deleted ", error);
      this.modal.close();

    })
  }

}
