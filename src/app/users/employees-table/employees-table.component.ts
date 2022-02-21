import { Component, OnDestroy, OnInit } from '@angular/core';
import {QueryList, ViewChildren} from '@angular/core';
import { Observable} from 'rxjs';

import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalComponent } from '../ngbd-modal/ngbd-modal.component';

import { Employee } from 'src/app/models';
import { TableService } from 'src/app/services/_table.service/table.service';
import {SorteableDirective, SortEvent} from '../../directives/sorteable.directive';

@Component(
  {selector: 'ngbd-table-complete',
   templateUrl: './employees-table.component.html',
   styleUrls: ['./employees-table.component.css'],
})
export class EmployeesTableComponent implements OnInit, OnDestroy {
  employees$: Observable<Employee[]> ;
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
    this.service.uploadTable();
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
    console.log('indice', index)
    const modalRef = this.modalService.open(NgbdModalComponent, { size: 'xl' });
    modalRef.componentInstance.user = this.service.empleadosValue[index];
  }




  ngOnDestroy(){

  }
}
