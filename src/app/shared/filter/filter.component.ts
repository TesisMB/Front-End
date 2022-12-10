import { Observable } from 'rxjs';
import { StatesService } from 'src/app/resources/states/states.service';
import { ReportService } from 'src/app/services/_report.service/report.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ResourcesService } from 'src/app/resources/resources.service';
import { RequestService } from 'src/app/resources/request/request.service';
import { SelectTypesEmergencyDisasterService } from 'src/app/emergency-disaster/select-types-emergency-disaster.service';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {
  @Input() datepicker:boolean = null;
  @Input() withStock:boolean = null;
  @Input() withDonation:boolean = null;
  @Input() withResourceType:boolean = null;
  @Input() withConditionType:boolean = null;
  @Input() withResetForm:boolean = null;
  @Input() withLocation:boolean = null;
  @Input() withAlertType:boolean = null;
  
locations : Observable<any> = new Observable<any>();
hasAvailability: Observable<boolean>;
hasDonation: Observable<boolean>;
resourceType: Observable<any>;
requestAlertType: Observable<any>;
requestCondition: Observable<string>;
alertState: Observable<string>;
// from;
// to;
  constructor(
    public service: ReportService,
    private stateService: StatesService,
    private resourceService: ResourcesService,
    private requestService: RequestService,
    public alertService: SelectTypesEmergencyDisasterService
    ) { 
    this.locations = stateService.getAll();
    this.hasAvailability = service.hasAvailability$;
    this.hasDonation = service.hasDonation$;
    this.resourceType = resourceService.type$;
    this.requestCondition = requestService.condition$;
    this.requestAlertType = service.alertTypes$;
    
  }

  ngOnInit(): void {
    this.locations = this.stateService.getAll();
    this.hasAvailability = this.service.hasAvailability$;
    this.hasDonation = this.service.hasDonation$;
  }

  changeResourceType(type: string){
    this.resourceService.type = type;
  }
  changeRequestType(condition: string){
    this.requestService.condition = condition;
  }
  changeAlertState(status: string){
    // this.alertService.alertStatus = status;
    this.service.alertStatus = status;
  }
  changeLocationCity(locationID : number | string){
    // this.resourceService.location = locationID;
    this.service.location = locationID;
  }
  changeAlertType(type : string){
    // this.service.alertStatus = type.toLowerCase();
    // this.service.searchTerm = type.toLowerCase();
    this.service.alertType = type;
  }
  changeView(){
  const searchType =  this.service.searchType;
  this.service.searchType = searchType.includes('table') ? 'reportes' : searchType;
  }

  resetForm(){
    this.service.resetForm();
  }

ngOnDestroy(): void {
    
}
}
