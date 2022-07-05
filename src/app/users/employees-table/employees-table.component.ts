import { Component, OnDestroy, OnInit } from '@angular/core';
import {QueryList, ViewChildren} from '@angular/core';
import { Observable} from 'rxjs';

import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalComponent } from '../ngbd-modal/ngbd-modal.component';

import { Employee } from 'src/app/models';
import { TableService } from 'src/app/services/_table.service/table.service';
import {SorteableDirective, SortEvent} from '../../directives/sorteable.directive';
import { UserService } from '../user.service';
import { AuthenticationService } from 'src/app/services';

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
  currentUser: any;



  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
  constructor( 
    private modalService: NgbModal,
    public service: TableService,
    private userService: UserService,
    private authService: AuthenticationService,
    ) {

    
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

  

  generatePDF(){ 

    //let fileName = `${this.user.users.persons.firstName} ${this.user.users.persons.lastName}`;
      let fileName = `${this.currentUser.persons.firstName} ${this.currentUser.persons.lastName}`;
      this.userService.generatePDFVolunteer(this.authService.currentUserValue.userID).subscribe(res => {
        const file = new Blob([<any>res], {type: 'application/pdf'});
      //  saveAs(file, fileName);
        const fileURL = window.URL.createObjectURL(file);
        window.open(fileURL, fileName);
      });
    }


  ngOnDestroy(){  
     
  }
}
