import { Alerts } from './../../models/alerts';
import { Employee } from './../../models/employee';
import { EmergencyDisasterService } from './../emergency-disaster.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  model : any;
  user: Employee [];
  employeeSelected: number;
  alerts: Alerts[];
  emergencyDisasterForm: FormGroup;
  tipo: string;
  cloneForm;




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

    const chat = this.chat;
    const messages = this.messages;
    const resourcesRequests = this.resourcesRequests;
    const resources = this.resources;


    this.emergencyDisaster.chatRooms.usersChatRooms.forEach(times => chat.push(this.fb.group(times)));

    this.emergencyDisaster.chatRooms.messages.forEach(times => messages.push(this.fb.group(times)));

    this.emergencyDisaster.resources_Requests.forEach(times => resourcesRequests.push(this.fb.group(times)));


    
/*     const emergency = {
          emergencyDisasterID: this.emergencyDisaster.emergencyDisasterID,
          emergencyDisasterInstruction: this.emergencyDisaster.emergencyDisasterInstruction,
          Fk_EmplooyeeID: this.emergencyDisaster.employees.employeeID,
          FK_AlertID: id.alertID,
          victims: this.emergencyDisaster.victims
    }; */

  
    let employee =  this.emergencyDisaster.employees.employeeID;
    this.EmplooyeeID.patchValue(employee);

    
    let id = this.alerts.find(alertDegree => alertDegree.alertID === this.emergencyDisaster.alerts.alertID);
    this.emergencyDisaster.alerts.alertID = id.alertID;
    this.alertID.patchValue(id.alertID);




  
    this.emergencyDisasterForm.patchValue(this.emergencyDisaster);
    this.model = _.cloneDeep(this.emergencyDisaster);
    //this.cloneForm = this.emergencyDisasterForm.value;

    if(this.tipo === 'Finalizar' ){
      this.f.controls['Fk_EmplooyeeID'].disable();
      this.f.controls['FK_AlertID'].disable();
    }

}

public get f() { return this.emergencyDisasterForm }

get chat(): FormArray { return this.emergencyDisasterForm.get('chatRooms.usersChatRooms') as FormArray; }


get messages(): FormArray { return this.emergencyDisasterForm.get('chatRooms.messages') as FormArray; }

get resourcesRequests(): FormArray { return this.emergencyDisasterForm.get('resources_Requests') as FormArray; }

get resources(): FormArray { return this.emergencyDisasterForm.get('resources_RequestResources_Materials_Medicines_Vehicles') as FormArray; }


get alertID(){ return this.emergencyDisasterForm.get('FK_AlertID') }

get alertName(){ return this.emergencyDisasterForm.get('alerts.alertDegree') }

get EmplooyeeID(){ return this.emergencyDisasterForm.get('Fk_EmplooyeeID') }

get EndDate(){ return this.emergencyDisasterForm.get('emergencyDisasterEndDate') }


changeEmployeedID(){
  let employee =  (this.user.find(user => user.employeeID == this.EmplooyeeID.value));
  this.EmplooyeeID.patchValue(employee.employeeID);
}

setRole(){
  let alert = (this.alerts.find(alert => alert.alertID == this.alertID.value));
  this.alertID.patchValue(alert.alertID);
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
      this.EndDate.patchValue(fecha);
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
    if(this.emergencyDisasterForm.valid){
      let patch = compare(this.model, this.emergencyDisasterForm.value);
      //let patch = compare(this.model, this.emergencyDisaster);

      patch = patch.filter( obj => obj.op !== 'add');
      patch = patch.filter( obj => obj.op !== 'remove');
      //patch = patch.filter( obj => obj.path !== "/alerts");

    
      console.log("Patch =>", patch);

   /*    let alert = (this.alerts.find(alertDegree => alertDegree.alertDegree === this.alertName.value));
      this.emergencyDisaster.alerts = alert;
      this.alertID.patchValue(alert.alertID);

     let employee =  (this.user.find(user => user.employeeID == this.EmplooyeeID.value));
      this.emergencyDisaster.employees.employeeID = employee.employeeID; 
      this.EmplooyeeID.patchValue(employee.employeeID); */

      this.patch(patch);
      this.dialogRef.close();
    }
  }

  initForm(): FormGroup{
    return this.fb.group({
      emergencyDisasterID:[],
      emergencyDisasterStartDate: [],
      emergencyDisasterEndDate: [],
      emergencyDisasterInstruction:['', [Validators.required]],
      Fk_EmplooyeeID: ['', [Validators.required]],
      FK_AlertID: [],
      employees: this.fb.group({
        employeeID: [],
        status: [],
        userAvailability: [],
        userID: [],
        roleName: [],
        name: [],
        userDni: []
      }),
      victims: this.fb.group({
        id: [],
        numberDeaths: ['', [Validators.required, Validators.min(0)]],
        numberAffected: ['', [Validators.required, Validators.min(0)]],
        numberFamiliesAffected: ['', [Validators.required, Validators.min(0)]],
        materialsDamage: ['', [Validators.required, Validators.min(0)]],
        affectedLocalities: ['', [Validators.required, Validators.min(0)]],
        evacuatedPeople: ['', [Validators.required, Validators.min(0)]],
        affectedNeighborhoods: ['', [Validators.required, Validators.min(0)]],
        assistedPeople: ['', [Validators.required, Validators.min(0)]],
        recoveryPeople: ['', [Validators.required, Validators.min(0)]],
      }),
      alerts: this.fb.group({
        alertID: [],
        alertDegree: [],
        alertMessage: []
      }),

      typesEmergenciesDisasters: this.fb.group({
        typeEmergencyDisasterID: [],
        typeEmergencyDisasterName: [],
        typeEmergencyDisasterIcon: [],
        typeEmergencyDisasterDescription: []
      }),

        locationsEmergenciesDisasters: this.fb.group({
        locationDepartmentName: [],
        locationCityName: [],
        locationMunicipalityName: [],
        locationLatitude: [],
        locationLongitude: []
      }),
      chatRooms: this.fb.group({
        id: [],
        creationDate: [],
              usersChatRooms: this.fb.array([
                this.fb.group({
                  userID: [],
                  name: [],
                  userDni: [],
                  roleName: [],
              })
            ]),

              messages: this.fb.array([
                this.fb.group({
                    ID: [],
                    message: [],
                    messagesState: [],
                    createdDate: [],
                    FK_UserID: [],
                    name: []
              })
            ]),
      }),


      resources_Requests: this.fb.array([
        this.fb.group({
        id: [],
        requestDate: [],
        reason: [],
        condition: [],
      })
    ]),
      resources_RequestResources_Materials_Medicines_Vehicles: this.fb.array([
        this.fb.group({
        id: [],
        fk_Resource_RequestID: [],
    
        materials: [],
        medicines: [],
        vehicles: []

      })
    ]),
      })
  }

  getUser(){
    this.userService.getAll().subscribe(data => {
      this.user = data;

      this.user = this.user.filter(a => a.users.roleName == "Coord. de Emergencias");
    }, error =>{
      console.log(error);
    })
  }

  //validaciones materialDamage
  patch(value){
    this.emergencyDisasterService.patchEmergencyDisaster(this.emergencyDisaster, value).subscribe(data =>{
      this.alertService.success('Actualizado correctamente :)', { autoClose: true });
      
      this.selectTypesEmergencyDisasterService._setEmployee(this.emergencyDisasterForm.value);

      this.model = _.cloneDeep(this.emergencyDisaster);
      //console.log("Actualizado correctamente!!", emergencia);
    }, error => {
      this.alertService.error('Hubo un error :(', { autoClose: true });
      console.log("Error", error);
    })
  }


}
