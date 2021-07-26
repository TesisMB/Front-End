import { AuthenticationService } from './../../services/_authentication/authentication.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {QueryList, ViewChildren} from '@angular/core';
import { Observable, Subject } from 'rxjs';

import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalComponent } from '../ngbd-modal/ngbd-modal.component';

import { Employee } from 'src/app/models';
import { UserService } from '..';
import { TableService } from 'src/app/services/_table.service/table.service';
import {SorteableDirective, SortEvent} from '../../directives/sorteable.directive';
import { AlertService } from 'src/app/services';

@Component(
  {selector: 'ngbd-table-complete',
   templateUrl: './employees-table.component.html',
   styleUrls: ['./employees-table.component.css'],
})
export class EmployeesTableComponent implements OnInit, OnDestroy {
  employees$: Observable<Employee[]>;
  total$: Observable<number>;
  getHandler: any="";
  patchHandler: any ="";
  error: any = "";
  

  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
  constructor( 
    private modalService: NgbModal,
    public service: TableService) {

    
  }
ngOnInit() {
    this.employees$ = this.service.employees$;
    this.total$ = this.service.total$;

}
  onShow(event){
    this.service.showAvailability = event.checked; 
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
  open(index) {
    const modalRef = this.modalService.open(NgbdModalComponent, { size: 'xl' });
    modalRef.componentInstance.user = this.service.empleadosValue[index];      
  }

  
//*********************** PROBANDO EL FILTRADO ********************* */
  // getEmployees() {
  // this.employees$.pipe().subscribe
  //   (result =>{
  //     this.modelo = result; 
  //     this.error = this.modelo
  //     .filter(x => x.users.estates.locationAddress == this.authenticationService.currentUserValue.estates.locationAddress);
  //     console.log(this.modelo);
  //   },
  //   error => {
  //     console.log("Ha ocurrido un error: "+ error.message);});
  //  }

  ngOnDestroy(){
   // this.getHandler.unsubscribe();
   
  }
}
