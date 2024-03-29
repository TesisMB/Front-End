import { Subscription, Observable, pipe } from 'rxjs';
import { RequestService } from './request.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Request, RequestGet } from 'src/app/models/requestCart.model';
import { filter, map } from 'rxjs/operators';
import { RequestTableService } from '../request-table/request-table.service';
import { AlertService, AuthenticationService } from 'src/app/services';

const CONDITION = 'Pendiente';
@Component({
  selector: 'request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit, OnDestroy {
  handleRequest: Subscription;
  constructor(
    public service: RequestTableService,
    private requestService: RequestService,
    private authService: AuthenticationService,
    private alertService: AlertService) {
    
     }
  ngOnInit(): void {
    this.getRequest();
  }


  getRequest(){
    this.handleRequest = this.requestService.getAll(CONDITION)
    .subscribe((x: any) =>{
    this.service._uploadTable(x);
    //this.service._setCondition(this.condition);
      console.log('x => ', x);
    },
  e => {
    this.alertService.error('Error, Intente mas tarde :(', {autoClose : true});
  
  } );
  }

ngOnDestroy(): void {
  this.handleRequest.unsubscribe();
}
}
