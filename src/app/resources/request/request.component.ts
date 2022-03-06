import { Subscription, Observable, pipe } from 'rxjs';
import { RequestService } from './request.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Request, RequestGet } from 'src/app/models/requestCart.model';
import { filter, map } from 'rxjs/operators';
import { RequestTableService } from '../request-table/request-table.service';
import { AlertService } from 'src/app/services';

@Component({
  selector: 'request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit, OnDestroy {
  condition: string  = 'Pendiente';
  handleRequest: Subscription;
  constructor(
    public service: RequestTableService,
    private requestService: RequestService,
    private alertService: AlertService) {
    
     }
  ngOnInit(): void {
  }


  getRequest(){
    this.handleRequest = this.requestService.getAll(this.condition)
    .subscribe((x: any) =>{
    this.service._uploadTable(x);
    this.service._setCondition(this.condition);
      console.log('x => ', x);
    },
  e => {
    this.alertService.error('Error, Intente mas tarde :(', {autoClose : true});
  
  } );
  }

ngOnDestroy(): void {
}
}
