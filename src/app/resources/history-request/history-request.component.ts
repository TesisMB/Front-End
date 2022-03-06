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
  condition: string  = 'Pendiente';
  handleRequest: Subscription;
  constructor(
    public service: RequestTableService,
    private requestService: RequestService,
    private alertService: AlertService) {
    
     }

  ngOnInit(): void {
    this.getRequest();
  }
get pendiente(){ this.condition = 'Pendiente'; return this.condition}
get aceptadas(){this.condition ='Aceptada'; return this.condition}
get rechazadas(){this.condition ='Rechazada'; return this.condition}

getRequest(){
  this.handleRequest = this.requestService.getAll(this.condition)
  .subscribe((x: any) =>{
  this.service._uploadTable(x);
  this.service._setCondition(this.condition);
    console.log('x => ', x);
  },
e => {
  this.alertService.error('Error, usuario no inicializado :(');

} );
}

ngOnDestroy(): void {
  this.handleRequest.unsubscribe();
}
  }


