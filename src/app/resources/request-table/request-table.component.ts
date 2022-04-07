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

@Component({
  selector: 'request-table',
  templateUrl: './request-table.component.html',
  styleUrls: ['./request-table.component.css']

})
export class RequestTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() condition = 'Pendiente';
  request$: Observable<RequestGet[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;
  currentUser: User = JSON.parse(localStorage.getItem('currentUser'));

  request: RequestGet[];
  handleRequest: Subscription;
  handleUser: Subscription;

  modalRef:any;

    constructor( private alertService: AlertService,
      public service: RequestTableService,
      private modalService: NgbModal,
      private userService: UserService,
      ) {}

  ngOnInit(): void {
    this.request$  = this.service.request$;
    this.total$ = this.service.total$;
    this.loading$ = this.service.loading$;
    this.request = this.service.requestValue;
  }

    get isAdmin(){       
       return this.currentUser.roleName === 'Admin';
      }
      get isCG(){
        
        return this.currentUser.roleName ===  'Coordinador General';
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


  ngOnDestroy(): void {
    if( this.handleUser){
      this.handleUser.unsubscribe();
    }

  }
}
