import { EmergencyDisaster } from './../../models/emergencyDisaster';
import { SelectTypesEmergencyDisasterService } from './../select-types-emergency-disaster.service';
import { TypesEmergencyDisaster } from './../../models/typeEmergencyDisaster';
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import {Observable, pipe, Subscription} from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { EmergencyDisasterService } from '../emergency-disaster.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'layout-emergency-disaster',
  templateUrl: './layout-emergency-disaster.component.html',
  styleUrls: ['./layout-emergency-disaster.component.css']
})
export class LayoutEmergencyDisasterComponent implements OnInit, OnDestroy {


  constructor(
    ) {
  }
  
  ngOnInit(): void {
 
  }

  ngOnDestroy(): void {
  }


}
