import { AlertService } from './../../services/_alert.service/alert.service';
import { RequestService } from './../request/request.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestTableService } from '../request-table/request-table.service';

@Component({
  selector: 'history-request',
  templateUrl: './history-request.component.html',
  styleUrls: ['./history-request.component.css']
})
export class HistoryRequestComponent implements OnInit, OnDestroy {
  //condition: string  = 'Pendiente';
  tabs = ['Pendiente', 'Aceptada', 'Rechazada'];
  handleRequest: Subscription;
  constructor(
    public service: RequestTableService,
    private requestService: RequestService,
    private alertService: AlertService) {
    
     }

  ngOnInit(): void {
    this.getRequest('Pendiente');
  }

// get pendiente(){ this.condition = 'Pendiente'; return this.condition}
// get aceptadas(){this.condition ='Aceptada'; return this.condition}
// get rechazadas(){this.condition ='Rechazada'; return this.condition}

changeCondition(event){
  const condition =  event.tab.textLabel;
  console.log('Tab cambiada', event.tab.textLabel);
  // this.condition = condition;
   this.service._setCondition(condition);
   this.getRequest(condition);
}

getRequest(condition){
  this.handleRequest = this.requestService.getAll(condition)
  .subscribe((x: any) =>{
  this.service._uploadTable(x);
  this.service._setCondition(condition);
    console.log('x => ', x);
  },
e => {
  this.alertService.error('Ups..! error inesperado, vuelva a intentar mas tarde', {autoClose: true});

} );
}

ngOnDestroy(): void {
 // this.handleRequest.unsubscribe();
}
  }


