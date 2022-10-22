import { Component, OnDestroy, OnInit } from '@angular/core';
import {QueryList, ViewChildren} from '@angular/core';
import { Observable} from 'rxjs';

import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MatDialog} from '@angular/material/dialog';
import { NgbdModalComponent } from '../ngbd-modal/ngbd-modal.component';

import { Employee, User } from 'src/app/models';
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
  employees$: Observable<User[]> ;
  total$: Observable<number>;
  getHandler: any="";
  patchHandler: any ="";
  error: any = "";
  currentUser: any;
  loading = false;



  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
  constructor( 
    private modalService: NgbModal,
    public service: TableService,
    private userService: UserService,
    private authService: AuthenticationService,
    public dialog: MatDialog
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

  openDialog(index): void {
    const dialogRef = this.dialog.open(NgbdModalComponent, {
      //  width: '800px',
      data: {user: this.service.empleadosValue[index]}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
//**********************REFACTORIZAR************
  generatePDF(){  
    // this.loading = true;

    //   let fileName = 'Empleado';
    //   this.userService.generatePDFEmployees(this.authService.currentUserValue.userID).subscribe(res => {
    //     const file = new Blob([<any>res], {type: 'application/pdf'});
    //   //  saveAs(file, fileName);
    //     const fileURL = window.URL.createObjectURL(file);
    //     window.open(fileURL, fileName);
    //     this.loading = false;

    //   });
    }
    


  ngOnDestroy(){  
     
  }
}
