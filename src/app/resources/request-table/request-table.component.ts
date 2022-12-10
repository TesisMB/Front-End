import { ReportService } from 'src/app/services/_report.service/report.service';
import { ResourceModalComponent } from './../../shared/resource-modal/resource-modal.component';
import { AlertService } from './../../services/_alert.service/alert.service';
import { UserService } from './../../users/user.service';
import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {Request, RequestGet} from './../../models/requestCart.model';
import { Observable, Subscription } from 'rxjs';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalComponent } from '../../users/ngbd-modal/ngbd-modal.component';
import { RequestTableService } from './request-table.service';
import { AuthenticationService } from 'src/app/services';
import { User } from 'src/app/models/user';
import { NgbdResourcesFiltersDialogComponentComponent } from '../ngbd-resources-filters-dialog-component/ngbd-resources-filters-dialog-component.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'request-table',
  templateUrl: './request-table.component.html',
  styleUrls: ['./request-table.component.css']

})
export class RequestTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() condition = 'Pendiente';
  request$: Observable<RequestGet[]>;
  @Input() title: string;
  total$: Observable<number>;
  loading$: Observable<boolean>;
  currentUser: User = JSON.parse(localStorage.getItem('currentUser'));

  request: RequestGet[];
  handleRequest: Subscription;
  handleUser: Subscription;

  modalRef:any;

    constructor(
      public dialog: MatDialog,
      private alertService: AlertService,
      public service: RequestTableService,
      private modalService: NgbModal,
      private userService: UserService,
      private authenticateService: AuthenticationService,
      public reportService: ReportService
      ) {}

  ngOnInit(): void {
    
    this.request$  = this.service.request$;
    this.total$ = this.service.total$;
    this.loading$ = this.service.loading$;
    this.request = this.service.requestValue;

  }

    get isAdmin(){       
      return this.currentUser.roleName === 'Admin' || this.currentUser.roleName ===  'Coord. General';
      }

  ngAfterViewInit(){}

  onShow(event){
    this.service.filter = event.checked; 
  }
  
  openModal(patch, i){
    if(patch === 'info'){
      const modalRef = this.modalService.open(ResourceModalComponent, { size: 'lg', centered: true, scrollable: true });
      modalRef.componentInstance.resources = this.service.requestValue[i];
  }
    else if(patch === 'employee'){

      this.getUser(i);
  }
}

    getUser(id){
      this.handleUser = this.userService.getById(id)
      .subscribe(x =>{
        const modalRef = this.modalService.open(NgbdModalComponent, { size: 'xl' });
        modalRef.componentInstance.user = x;
        }, 
        e => {
          this.alertService.error('Error, usuario no inicializado :(', {autoClose: true});
        } );
    }

    
generatePDF(){ 
  //let fileName = `${this.user.users.persons.firstName} ${this.user.users.persons.lastName}`;
    let fileName = `${this.authenticateService.currentUserValue.persons.firstName} ${this.authenticateService.currentUserValue.persons.lastName}`;
    this.service.generatePDF(this.authenticateService.currentUserValue.estates.estateID, this.title).subscribe(res => {
      const file = new Blob([<any>res], {type: 'application/pdf'});
    //  saveAs(file, fileName);
      const fileURL = window.URL.createObjectURL(file);
      window.open(fileURL, fileName);
    });
  }


  openDialog(tipo: string){
    const dialogRef = this.dialog.open(NgbdResourcesFiltersDialogComponentComponent);
    dialogRef.componentInstance.tipo = tipo;
  
  }

  ngOnDestroy(): void {
    if( this.handleUser){
      this.handleUser.unsubscribe();
    }
    // this.service._uploadTable([]);


  }
}
