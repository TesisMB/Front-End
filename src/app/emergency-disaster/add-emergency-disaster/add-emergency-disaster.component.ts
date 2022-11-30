import { AuthenticationService } from './../../services/_authentication/authentication.service';
import { UserService } from './../../users/user.service';
import { PlacesService } from './../places.service';
import { Alerts } from './../../models/alerts';
import { EmergencyDisasterService } from './../emergency-disaster.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { TypesEmergencyDisaster } from 'src/app/models/typeEmergencyDisaster';
import { SelectTypesEmergencyDisasterService } from '../select-types-emergency-disaster.service';
import { Feature } from 'src/app/models/places';
import { Ubicacion } from 'src/app/models/Parametros';
import { Employee, User } from 'src/app/models';
import { AlertService } from 'src/app/services';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import {   
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'add-emergency-disaster',
  templateUrl: './add-emergency-disaster.component.html',
  styleUrls: ['./add-emergency-disaster.component.css']
})
export class AddEmergencyDisasterComponent implements OnInit, OnDestroy {
  // @ViewChild('stepper',{read:MatStepper}) stepper:MatStepper;

  arraytypeEmergencyDisaster = [];
  typeEmergencyDisaster: TypesEmergencyDisaster[];
  subscriber1: Subscription;
  subscriber2: Subscription;
  subscriber3: Subscription;
  subscriber4: Subscription;
  subscriber5: Subscription;
  locationB: boolean = false;
  addEmergencyDisaster: FormGroup;
  alerts: Alerts[];
  placeObservable: Feature;
  currentPlaceHandler: any;
  coordinates: Ubicacion;
  handler: any;
  currentUser: User;
  user: User [];
  ubicacion: any;
  hasVictims: boolean = false;
z
  constructor(   
    private location: Location,
    private selectTypesEmergencyDisasterService : SelectTypesEmergencyDisasterService,
    private emergencyDisasterService: EmergencyDisasterService,
    private fb: FormBuilder,
    private placesService: PlacesService,
    private authenticationService: AuthenticationService,
    private userService : UserService,
    private alertService: AlertService,
    private _snackBar: MatSnackBar
    ) {

      this.addEmergencyDisaster = this.fb.group({
        FK_TypeEmergencyID: ['', Validators.required],
        FK_AlertID: ['', Validators.required],
        Fk_EmplooyeeID: ['', Validators.required],
        emergencyDisasterInstruction: ['', Validators.required],        
        locationsEmergenciesDisasters: this.fb.group({
          locationCityName: [, [Validators.required]],
          locationDepartmentName: [],
          locationMunicipalityName: [],
          locationLongitude: [, [Validators.required]],
          LocationLatitude: [, [Validators.required]],
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
     get formMap() { return this.addEmergencyDisaster.get('locationsEmergenciesDisasters');}
     get errorMap() { return this.addEmergencyDisaster.get('locationsEmergenciesDisasters.locationCityName').hasError('required')
                              || this.addEmergencyDisaster.get('locationsEmergenciesDisasters.locationLongitude').hasError('required')
                              || this.addEmergencyDisaster.get('locationsEmergenciesDisasters.LocationLatitude').hasError('required');}



  ngOnInit(): void {
    this.subscriber1 =  this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
      console.log("Data", data);
    }, error => {
      console.log("Error", error);
    });

    this.getUser();
    this.addEmergencyDisasterFunction();


    this.alerts = this.emergencyDisasterService.ListarAlertas;
    this.getTypeEmergencyDisaster();

    
  }


  onBack() {
    this.location.back();
  }

  getUser(){
    this.subscriber2 = this.userService.getAll().subscribe(data => {
      this.user = data;
      this.user = this.user.filter(a => a.roleName == "Coord. de Emergencias");
    }, error =>{
      console.log(error);
    })
  }

  addEmergencyDisasterFunction(){
    this.subscriber3 = this.placesService.placeSubject$.subscribe(resp => {
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
    this.addEmergencyDisaster.get('locationsEmergenciesDisasters.locationLongitude').patchValue(placeObservable.center[0]);
    this.addEmergencyDisaster.get('locationsEmergenciesDisasters.LocationLatitude').patchValue(placeObservable.center[1]);
    this.addEmergencyDisaster.get('locationsEmergenciesDisasters.locationCityName').patchValue(placeObservable.place_name);

    console.log("Place Name", placeObservable.place_name);
  }
    
  

  postEmergencyDisaster(){
    console.log('Formulario =>', this.addEmergencyDisaster.valid);

    if(this.addEmergencyDisaster.valid){

     // this.addEmergencyDisaster.get('locationsEmergenciesDisasters.locationCityName').patchValue(this.ubicacion.municipio.nombre);
      
      this.addEmergencyDisaster.get('FK_EstateID').patchValue(this.currentUser.estates.estateID);

      
      const emergency = this.addEmergencyDisaster.value;
      console.log('Formulario =>', emergency);
      
      this.subscriber4 =   this.emergencyDisasterService.register(emergency).subscribe( () =>{
      // this.alertService.success('Registro exitoso :)', { autoClose: true });
      this.openSnackBar(
        'Se ha registrado correctamente la alerta y se notifico a los voluntarios',
        ':)',
        'center',
        'top',
        5000
      );
      // this.stepper.reset();
        
      }, error =>{
        // this.alertService.error('Ocurrio un error :(', { autoClose: true });
        this.openSnackBar(
          'Ups! ocurrio un error al intentar registrar la alerta, por favor intentelo mas tarde',
          'Ok',
          'center',
          'top',
          5000
        );
        console.log("Error en el formulario!!!", error);
      });
    }
    
    else if(this.errorMap){
      this.openSnackBar(
        'El formulario esta incompleto, por favor seleccione la ubicación de la alerta',
        'Entendido!',
        'center',
        'top',
        5000
      );
    //   this.alertService.error('La API no esta funcionando correctamente, por favor reintentar en un rato.', {autoClose: true});
    }
  }


  getTypeEmergencyDisaster(){
    this.subscriber5 =  this.selectTypesEmergencyDisasterService.getAll()
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

  openSnackBar(msg, action, horizontalPosition, verticalPosition, duration) {
    this._snackBar.open(msg, action, {
      duration: duration,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
    });
  }
  ngOnDestroy(): void {
  if(this.subscriber1) this.subscriber1.unsubscribe();
  if(this.subscriber2)   this.subscriber2.unsubscribe();
  if(this.subscriber3)   this.subscriber3.unsubscribe();
  if(this.subscriber4)   this.subscriber4.unsubscribe();
  if(this.subscriber5)   this.subscriber5.unsubscribe();
  }

}
