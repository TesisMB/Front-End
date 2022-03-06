import { EmergencyDisaster } from './../../models/emergencyDisaster';
import { SelectTypesEmergencyDisasterService } from './../select-types-emergency-disaster.service';
import { TypesEmergencyDisaster } from './../../models/typeEmergencyDisaster';
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import {Observable, pipe, Subscription} from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { EmergencyDisasterService } from '../emergency-disaster.service';

@Component({
  selector: 'layout-emergency-disaster',
  templateUrl: './layout-emergency-disaster.component.html',
  styleUrls: ['./layout-emergency-disaster.component.css']
})
export class LayoutEmergencyDisasterComponent implements OnInit, OnDestroy {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  emergencyDisaster: EmergencyDisaster [];
  selected: string;
  isActive: boolean = false;
  typeEmergencyDisaster: TypesEmergencyDisaster[];
  arraytypeEmergencyDisaster = [];
  id: number;
  status: boolean;
  handleSU: Subscription;


  constructor(
    private selectTypesEmergencyDisasterService : SelectTypesEmergencyDisasterService,
    private emergencyDisasterService: EmergencyDisasterService,
    ) {
  }

  
  
  ngOnInit(): void {
    this.getTypeEmergencyDisaster();
    
    this.getEmergencyDisaster();
    /* this.selectTypesEmergencyDisasterService.selectTypesEmergencyDisaster$.subscribe(
      (idTypes: number) => this.id = idTypes);
      

      this.selectTypesEmergencyDisasterService.statusTypesEmergencyDisaster$.subscribe(
        (idTypes: boolean) => this.status = idTypes); */

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
          name: "todos"
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
    this.handleSU =  this.emergencyDisasterService.getAllWithoutFilter()
 
        .subscribe(data => {
          this.emergencyDisaster = data;
          this.setEmergenciesDisaster(data);
         
     console.log('EmergencyDisaster - ListAll => ', data);
    }, error => {
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


  slideToogle(select : string){
    console.log("Checked: ", select);
    this.selected = select;

  }


  getcheckStatus(event) {

   /*  this.selectTypesEmergencyDisasterService.setStatus(event.checked);
    this.selectTypesEmergencyDisasterService.TypesEventBoolean.emit(event.checked); */
    console.log(event.checked)

    /*if(event.checked){
      this.emergencyDisaster = this.emergencyDisasterClone.filter(data => data.emergencyDisasterEndDate !== null);
    }
    else if (!event.checked){
      this.emergencyDisaster = this.emergencyDisasterClone.filter(data => data.emergencyDisasterEndDate === null);
    }*/
  }



  ngOnDestroy(): void {
    this.handleSU.unsubscribe();
  }


}
