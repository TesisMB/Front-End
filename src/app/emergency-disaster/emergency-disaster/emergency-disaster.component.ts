import { Router } from '@angular/router';
import { EmergencyDisaster } from './../../models/emergencyDisaster';
import { SelectTypesEmergencyDisasterService } from './../select-types-emergency-disaster.service';
import { TypesEmergencyDisaster } from './../../models/typeEmergencyDisaster';
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import {Observable, pipe, Subscription} from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { EmergencyDisasterService } from '../emergency-disaster.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services';
import { ReportService } from 'src/app/services/_report.service/report.service';


@Component({
  selector: 'emergency-disaster',
  templateUrl: './emergency-disaster.component.html',
  styleUrls: ['./emergency-disaster.component.css']
})
export class EmergencyDisasterComponent implements OnInit, OnDestroy {

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  emergencyDisaster: EmergencyDisaster [];
  selected: string;
  isActive: boolean = false;
  typeEmergencyDisaster: TypesEmergencyDisaster[];
  arraytypeEmergencyDisaster = [];
  id: number;
  status: boolean;
  handleSU: Subscription;
  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  isLoading: boolean = true;
  form: FormGroup;




  constructor(
    public selectTypesEmergencyDisasterService : SelectTypesEmergencyDisasterService,
    private emergencyDisasterService: EmergencyDisasterService,
    private router: Router,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    public reportService : ReportService
    ) {

      this.form = this.fb.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required]
      })
  }

  
  
  ngOnInit(): void {
    this.selectTypesEmergencyDisasterService.loading = true;
    this.getTypeEmergencyDisaster();
    
    this.getEmergencyDisaster();

    
      

      
    /* this.selectTypesEmergencyDisasterService.selectTypesEmergencyDisaster$.subscribe(
      (idTypes: number) => this.id = idTypes);
      

      this.selectTypesEmergencyDisasterService.statusTypesEmergencyDisaster$.subscribe(
        (idTypes: boolean) => this.status = idTypes); */

  }


  EmergencyDisaster(){

  }

  getTypeEmergencyDisaster(){
    this.selectTypesEmergencyDisasterService.getAll()
    .pipe(
      map((x) =>{
        x.forEach(item =>{
          const types = {
            id: item.typeEmergencyDisasterID,
            name: item.typeEmergencyDisasterName
          };
          this.arraytypeEmergencyDisaster.push(types);
        })

        this.arraytypeEmergencyDisaster.push({
          id: 8,
          name: "Todos"
        }
        );
          
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


  
  getEmergencyDisaster() {
     this.emergencyDisasterService.getAllWithoutFilter()
 
        .subscribe(data => {
          this.emergencyDisaster = data;
          this.setEmergenciesDisaster(data);
          this.isLoading = false;
          this.reportService.searchPath = 'alertName';
          this.reportService.data = data;         
     console.log('EmergencyDisaster - ListAll => ', data);
    }, error => {
      this.isLoading = false;
      console.log('Error', error);
    })
  }





  setEmergenciesDisaster(emergencyDisaster: EmergencyDisaster[]){
    this.selectTypesEmergencyDisasterService.uploadTable(emergencyDisaster);
  }

  selectTypes(id: number){
    console.log("data => ", id);
     this.selectTypesEmergencyDisasterService.setTypes(id);
    /*this.selectTypesEmergencyDisasterService.TypesEvent.emit(id); */
  }


/*   slideToogle(select : string){
    console.log("Checked: ", select);
    this.selectTypesEmergencyDisasterService.setStatus(event.checked);

  } */


  getcheckStatus(event) {
    this.selectTypesEmergencyDisasterService.setStatus(event.checked);
  }

  currentDate(event){
    const value = event.value;

    console.log(typeof value);
  }


  create(){
    this.router.navigate(['emergencias/agregar-emergencia-desastre']);
  }

  ngOnDestroy(): void {
    this.reportService.resetForm();
  }


}
