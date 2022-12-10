import { Subscription, Observable, pipe } from 'rxjs';
import { RequestService } from './request.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Request, RequestGet } from 'src/app/models/requestCart.model';
import { filter, map } from 'rxjs/operators';
import { RequestTableService } from '../request-table/request-table.service';
import { AlertService, AuthenticationService } from 'src/app/services';
import { User } from 'src/app/models';
import { ReportService } from 'src/app/services/_report.service/report.service';
import {isEqual, isUndefined} from 'lodash';

const PATH = ['condition','createdByEmployee','typeEmergencyDisasterName','resources_RequestResources_Materials_Medicines_Vehicles.length','locationCityName' ];
const CONDITION = 'Pendiente';
@Component({
  selector: 'request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
})
export class RequestComponent implements OnInit, OnDestroy {
  handleRequest: Subscription;
  handleReport:Subscription;
  handleCondition:Subscription;
  currentUser: Observable<User>;
  searchType: string;
  path : any = PATH;
  request = [];
  constructor(
    public service: RequestTableService,
    private requestService: RequestService,
    private authService: AuthenticationService,
    private alertService: AlertService,
    public reportService: ReportService
  ) {
    this.currentUser = this.authService.currentUser2;
    this.searchType = this.reportService.searchType;
    this.reportService.searchPath = this.path;
    this.reportService.path = this.path;
    this.requestService.condition = CONDITION;
  }
  ngOnInit(): void {
    this.handleCondition = this.requestService.condition$
    .subscribe(condition => {
      this.getRequest(condition);
    })
    
  }
  
  getRequest(condition: string) {
    this.service.loading = true;
    this.handleRequest = this.requestService.getAll(condition).subscribe(
      (x: any) => {
        this.getReportData();
        this.reportService.data = x;
        // this.request = x;

        //this.service._setCondition(this.condition);
        console.log('x => ', x);

      },
      (e) => {
        this.alertService.error('Error, Intente mas tarde :(', {
          autoClose: true,
        });
      }
    );
  }

  getReportData(){
    this.handleReport = this.reportService.originalData$.subscribe(report =>{
      // if(!isUndefined(report)){
      //   const results = isEqual(report.sort(), this.request.sort());
      //   if (!results) {
          // console.log('GetReportData => ', report);
          this.request = report;
          this.service._uploadTable(report);
          // }
      // }
    });
  }
  onShow(event){
    this.service.filter = event.checked; 
  }
   searchTerm(event){
    console.log('Llego el evento! => ',event);
    this.service.searchTerm = event;
   }

  ngOnDestroy(): void {
    this.reportService.resetForm(true);
    this.handleReport.unsubscribe();
    // if(this.handleRequest){
      this.handleRequest.unsubscribe();
    // }
    // if(this.handleCondition){
      this.handleCondition.unsubscribe();
    // }
  }
}
