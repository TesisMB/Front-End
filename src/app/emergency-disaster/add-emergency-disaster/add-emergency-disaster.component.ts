import { AuthenticationService } from './../../services/_authentication/authentication.service';
import { UserService } from './../../users/user.service';
import { PlacesService } from './../places.service';
import { Alerts } from './../../models/alerts';
import { Alert } from './../../models/alert';
import { EmergencyDisasterService } from './../emergency-disaster.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { TypesEmergencyDisaster } from 'src/app/models/typeEmergencyDisaster';
import { SelectTypesEmergencyDisasterService } from '../select-types-emergency-disaster.service';
import { Observable } from 'rxjs';
import { Feature } from 'src/app/models/places';
import { Ubicacion } from 'src/app/models/Parametros';
import { Employee, User } from 'src/app/models';
import { MatStepper } from '@angular/material/stepper';
import { AlertService } from 'src/app/services';

@Component({
  selector: 'add-emergency-disaster',
  templateUrl: './add-emergency-disaster.component.html',
  styleUrls: ['./add-emergency-disaster.component.css']
})
export class AddEmergencyDisasterComponent implements OnInit, OnDestroy {
  @ViewChild('stepper',{read:MatStepper}) stepper:MatStepper;

  arraytypeEmergencyDisaster = [];
  typeEmergencyDisaster: TypesEmergencyDisaster[];
  location: boolean = false;
  addEmergencyDisaster: FormGroup;
  alerts: Alerts[];
  placeObservable: Feature;
  currentPlaceHandler: any;
  coordinates: Ubicacion;
  handler: any;
  currentUser: User;
  user: Employee [];
  ubicacion: any;
  hasVictims: boolean = false;

  constructor(    
    private selectTypesEmergencyDisasterService : SelectTypesEmergencyDisasterService,
    private emergencyDisasterService: EmergencyDisasterService,
    private fb: FormBuilder,
    private placesService: PlacesService,
    private authenticationService: AuthenticationService,
    private userService : UserService,
    private alertService: AlertService
    ) {

      this.addEmergencyDisaster = this.fb.group({
        FK_TypeEmergencyID: ['', Validators.required],
        FK_AlertID: ['', Validators.required],
        Fk_EmplooyeeID: ['', Validators.required],
        emergencyDisasterInstruction: ['', Validators.required],        
        locationsEmergenciesDisasters: this.fb.group({
          locationCityName: [],
          locationDepartmentName: [],
          locationMunicipalityName: [],
          locationLongitude: [],
          LocationLatitude: []
        }),
        chatRooms: this.fb.group({
          FK_TypeChatRoomID: [1]
        }),
        victims: this.fb.group({
          numberDeaths: [, [Validators.min(0)]],
          numberAffected: [, [Validators.min(0)]],
          numberFamiliesAffected: [, [Validators.min(0)]],
          materialsDamage: [,  [Validators.min(0)]],
          affectedLocalities: [,  [Validators.min(0)]],
          evacuatedPeople: [,  [Validators.min(0)]],
          affectedNeighborhoods: [,  [Validators.min(0)]],
          assistedPeople: [,  [Validators.min(0)]],
          recoveryPeople: [,  [Validators.min(0)]],
        }),
         FK_EstateID: ['']
    })

     }

     get formEmergency () { return this.addEmergencyDisaster;}

     get formVictims() { return this.addEmergencyDisaster.get('victims');}
     get formType() { return this.addEmergencyDisaster.get('FK_TypeEmergencyID');}
     get formResponsable() { return this.addEmergencyDisaster.get('Fk_EmplooyeeID');}
     get formPriority() { return this.addEmergencyDisaster.get('FK_AlertID');}



  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
      console.log("Data", data);
    }, error => {
      console.log("Error", error);
    });

    this.addEmergencyDisasterFunction();


    this.alerts = this.emergencyDisasterService.ListarAlertas;
    this.getTypeEmergencyDisaster();
    this.getUser();

    
  }


  getUser(){
    this.userService.getAll(this.authenticationService.currentUserValue.userID).subscribe(data => {
      this.user = data;
      this.user = this.user.filter(a => a.users.roleName == "Coord. de Emergencias");
    }, error =>{
      console.log(error);
    })
  }

  addEmergencyDisasterFunction(){
    this.currentPlaceHandler = this.placesService.placeSubject$.subscribe(resp => {
      if(resp){
        this.getLocation(resp);
      }
    }, err => {
      console.log(err);
    });
    }

    handleVictims(event){
      this.hasVictims = event.value;
      console.log('Evento => ',event.value);
    }

  getLocation(placeObservable){
   this.handler = this.placesService.getLocation(placeObservable.center[1], placeObservable.center[0]).subscribe(resp =>{
    this.addEmergencyDisaster.get('locationsEmergenciesDisasters.locationLongitude').patchValue(placeObservable.center[0]);
    this.addEmergencyDisaster.get('locationsEmergenciesDisasters.LocationLatitude').patchValue(placeObservable.center[1]);
 
    this.ubicacion = resp.ubicacion;

    }, error=>{
      console.log("Error", error);
    });  
  }
    
  

  postEmergencyDisaster(){

    if(this.addEmergencyDisaster.valid && this.ubicacion){

      this.addEmergencyDisaster.get('locationsEmergenciesDisasters.locationCityName').patchValue(this.ubicacion.municipio.nombre);
      this.addEmergencyDisaster.get('locationsEmergenciesDisasters.locationDepartmentName').patchValue(this.ubicacion.departamento.nombre);
      this.addEmergencyDisaster.get('locationsEmergenciesDisasters.locationMunicipalityName').patchValue(this.ubicacion.municipio.nombre);
      this.addEmergencyDisaster.get('FK_EstateID').patchValue(this.currentUser.estates.estateID);

      
      const emergency = this.addEmergencyDisaster.value;
      console.log('Formulario =>', emergency);
      
      this.emergencyDisasterService.register(emergency).subscribe( () =>{
      this.alertService.success('Registro exitoso :)', { autoClose: true });
      this.stepper.reset();
        
      }, error =>{
        this.alertService.error('Ocurrio un error :(', { autoClose: true });
        console.log("Error en el formulario!!!", error);
      });
    }
    else if(this.addEmergencyDisaster.valid){
      this.alertService.error('La API no esta funcionando correctamente, por favor reintentar en un rato.', {autoClose: true});
    }
  }


  getTypeEmergencyDisaster(){
    this.selectTypesEmergencyDisasterService.getAll(this.authenticationService.currentUserValue.userID)
    .pipe(
      map((x) =>{
        x.forEach(item =>{
          const types = {
            id: item.typeEmergencyDisasterID,
            name: item.typeEmergencyDisasterName
          };
          this.arraytypeEmergencyDisaster.push(types);
        })

          console.log('arraytypeEmergencyDisaster []', this.arraytypeEmergencyDisaster);
          
          return x;
      }))
    .subscribe(data =>{
      this.typeEmergencyDisaster = data;
      console.log('typeEmergencyDisaster => ', this.typeEmergencyDisaster);
    }, error =>{
      console.log("Error =>", error);
    })
  }

  mapa(){
  
    /* this.router.navigate(['emergencias/ubicacion']); */
  }

 
  ngOnDestroy(): void {
   /*  this.handler.unsubscribe();
    this.currentPlaceHandler.unsubscribe(); */
  }

}
