import { Alerts } from './../../models/alerts';
import { Employee } from './../../models/employee';
import { EmergencyDisasterService } from './../emergency-disaster.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {compare} from 'fast-json-patch';
import { _deepClone } from 'fast-json-patch/module/helpers';
import * as _ from 'lodash';
import { UserService } from 'src/app/users';
import { AlertService } from 'src/app/services';
import { SelectTypesEmergencyDisasterService } from '../select-types-emergency-disaster.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdDeleteModalComponent } from '../ngbd-delete-modal/ngbd-delete-modal.component';

@Component({
  selector: 'ngbd-edit-dialog',
  templateUrl: './ngbd-edit-dialog.component.html',
  styleUrls: ['./ngbd-edit-dialog.component.css']
})
export class NgbdEditDialogComponent implements OnInit {

  @Input() emergencyDisaster: EmergencyDisaster;

  model : EmergencyDisaster;
  user: Employee [];
  employeeSelected: number;
  alerts: Alerts[];
  emergencyDisasterForm: FormGroup;
  tipo: string;

  constructor(
    public dialogRef: MatDialogRef<NgbdEditDialogComponent>,
    private fb: FormBuilder,
    private emergencyDisasterService : EmergencyDisasterService,
    private selectTypesEmergencyDisasterService : SelectTypesEmergencyDisasterService,
    private userService : UserService,
    private alertService: AlertService,
    private modalService: NgbModal,


  ) {}

  ngOnInit() {

    this.getUser();
    this.emergencyDisasterForm = this.initForm();
    this.alerts = this.emergencyDisasterService.ListarAlertas;
    this.f.patchValue(this.emergencyDisaster);
    
    this.model = _.cloneDeep(this.emergencyDisaster);
    
    let id = this.alerts.find(alertDegree => alertDegree.alertDegree === this.emergencyDisaster.alerts.alertDegree);
    this.alertID.patchValue(id.alertID);

    let employee =  this.emergencyDisaster.employees.employeeID;
    this.EmplooyeeID.patchValue(employee);

    if(this.tipo === 'Finalizar' ){
      this.f.controls['Fk_EmplooyeeID'].disable();
      this.f.controls['alerts'].disable();
    }
}

public get f() { return this.emergencyDisasterForm }

get alertID(){ return this.emergencyDisasterForm.get('FK_AlertID') }

get alertName(){ return this.emergencyDisasterForm.get('alerts.alertDegree') }

get EmplooyeeID(){ return this.emergencyDisasterForm.get('Fk_EmplooyeeID') }


changeEmployeedID(){
  let employee =  (this.user.find(user => user.employeeID == this.EmplooyeeID.value));
  this.emergencyDisaster.Fk_EmplooyeeID = employee.employeeID;
  this.EmplooyeeID.patchValue(employee.employeeID);
  //this.emergencyDisaster.Fk_EmplooyeeID = this.emergencyDisasterForm.value.Fk_EmplooyeeID;
}

setRole(){
  let alert = (this.alerts.find(alertDegree => alertDegree.alertDegree === this.alertName.value));


  this.emergencyDisaster.FK_AlertID = alert.alertID;

  this.alertID.patchValue(alert.alertID);

  console.log("Alertas", this.emergencyDisaster.alerts);
}



  alertColor(alert: string){
    if(alert === 'Extremo'){
      return '#FADBD8';
    }
    else if(alert === 'Moderado'){
      return '#FCF3CF';
    }
    else{
      return '#D5F5E3';
  
      }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  

  status(tipo: string){
    if(tipo === 'Editar'){
      this.updateEmergency(this.emergencyDisaster);
      this.onSubmit();
    }else{
      const fecha = new Date();

      this.emergencyDisaster.emergencyDisasterEndDate = fecha;
      this.updateEmergency(this.emergencyDisaster);
      this.onSubmit();
    }
  }


  openEndEmergency(tipo: string){
    const dialogRef = this.modalService.open(NgbdDeleteModalComponent, { centered: true });
    dialogRef.componentInstance.emergencyDisaster = this.emergencyDisaster;
    dialogRef.componentInstance.titulo = tipo;
  }


  updateEmergency(EmergencyDisaster: EmergencyDisaster){
    console.log("Model", EmergencyDisaster);
  }

  onSubmit(){
     let patch = compare(this.model, this.emergencyDisaster,);
    console.log("Patch =>", patch);

    this.patch(patch);
    this.dialogRef.close();
  }

  initForm(): FormGroup{
    return this.fb.group({
      emergencyDisasterInstruction:['', [Validators.required]],
      Fk_EmplooyeeID: ['', [Validators.required]],
      FK_AlertID:['', [Validators.required]],
      alerts: this.fb.group({
        alertDegree: [],
      }),
      victims: this.fb.group({
        numberDeaths: [],
        numberAffected: [],
        numberFamiliesAffected: [],
        materialsDamage: [],
        affectedLocalities: [],
        evacuatedPeople: [],
        affectedNeighborhoods: [],
        assistedPeople: [],
        recoveryPeople: [],
      })
      })
  }

  getUser(){
    this.userService.getAll().subscribe(data => {
      this.user = data;

      this.user = this.user.filter(a => a.users.roleName == "Coordinador de Emergencias y Desastres");
    }, error =>{
      console.log(error);
    })
  }

  patch(value){
    this.emergencyDisasterService.patchEmergencyDisaster(this.emergencyDisaster, value).subscribe(data =>{

      let alert = (this.alerts.find(alertDegree => alertDegree.alertDegree === this.alertName.value));
      this.emergencyDisaster.alerts = alert;

      let employee =  (this.user.find(user => user.employeeID == this.EmplooyeeID.value));
      this.emergencyDisaster.employees.employeeID = employee.employeeID;

      this.alertService.success('Actualizado correctamente :)', { autoClose: true });
     

      this.model = _.cloneDeep(this.emergencyDisaster);
      console.log("Actualizado correctamente!!", this.emergencyDisasterForm.value);
    }, error => {
      console.log("Error", error);
    })
  }


}
