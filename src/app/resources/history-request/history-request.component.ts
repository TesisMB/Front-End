import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'history-request',
  templateUrl: './history-request.component.html',
  styleUrls: ['./history-request.component.css']
})
export class HistoryRequestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
get pendiente(){ return 'Pendiente'}
get aceptadas(){ return 'Aceptado'}
get rechazadas(){ return 'Rechazado'}

}
