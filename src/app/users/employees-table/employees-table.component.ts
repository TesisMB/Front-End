import { Component, OnDestroy, OnInit } from '@angular/core';
import {QueryList, ViewChildren} from '@angular/core';
import { Observable, Subscription} from 'rxjs';

import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MatDialog} from '@angular/material/dialog';
import { NgbdModalComponent } from '../ngbd-modal/ngbd-modal.component';

import { Employee, User } from 'src/app/models';
import { TableService } from 'src/app/services/_table.service/table.service';
import {SorteableDirective, SortEvent} from '../../directives/sorteable.directive';
import { UserService } from '../user.service';
import { AlertService, AuthenticationService } from 'src/app/services';
import { RequestService } from 'src/app/resources/request/request.service';
import { RequestTableService } from 'src/app/resources/request-table/request-table.service';

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
  handleRequest: Subscription;



  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
  constructor( 
    private modalService: NgbModal,
    public service: TableService,
    private userService: UserService,
    private authService: AuthenticationService,
    public dialog: MatDialog,
    private requestService: RequestService,
    public requestTableService: RequestTableService,
    private alertService: AlertService,

    ) {

    
  }
ngOnInit() {
    this.employees$ = this.service.employees$;
    this.total$ = this.service.total$;

    this.getRequest("TODOS");
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


  getRequest(condition){
    this.handleRequest = this.requestService.getAll(condition)
    .subscribe((x: any) =>{
      this.requestTableService._uploadTable(x);
      this.requestTableService._setCondition(condition);
      console.log('x => ', x);
    },
  e => {
    this.alertService.error('Ups..! error inesperado, vuelva a intentar mas tarde', {autoClose: true});
  
  } );
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
