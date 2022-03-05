import { ResourceModalComponent } from './../../shared/resource-modal/resource-modal.component';
import { AlertService } from './../../services/_alert.service/alert.service';
import { UserService } from './../../users/user.service';
import { RequestService } from './../request/request.service';
import { Component, OnInit, PipeTransform, OnDestroy, Input, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import {Request, RequestGet} from './../../models/requestCart.model';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalComponent } from '../../users/ngbd-modal/ngbd-modal.component';
import { SorteableDirective } from 'src/app/directives/sorteable.directive';

@Component({
  selector: 'request-table',
  templateUrl: './request-table.component.html',
  styleUrls: ['./request-table.component.css'],
  providers: [DecimalPipe]

})
export class RequestTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() condition = 'Pendiente';
  request$: Observable<RequestGet[]>;
  filter = new FormControl('');
  page = 1;
  pageSize = 4;
  collectionSize = 10;
  request: RequestGet[];
  handleRequest: Subscription;
  handleUser: Subscription;
  encargado = {};
  modalRef:any;
  
  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;

  constructor(private pipe: DecimalPipe, private alertService: AlertService,
     private service: RequestService, private modalService: NgbModal,private userService: UserService) {
  }


  ngOnInit(): void {
    
    this.getRequest();
   
  }

  ngAfterViewInit(){
    this.request$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, this.pipe))
    );
  // console.log('refreshCountries => ',this.refreshCountries());

  }



   search(text: string, pipe: PipeTransform): RequestGet[] {
    return this.request.filter(request => {
      const term = text.toLowerCase();
      return request.users.name.toLowerCase().includes(term)
          || request.condition.toLowerCase().includes(term)
          || request.emergenciesDisasters.typesEmergenciesDisasters.typeEmergencyDisasterName.toLowerCase().includes(term)
          || request.emergenciesDisasters.locations.locationMunicipalityName.toLowerCase().includes(term)
          || request.emergenciesDisasters.locations.locationDepartmentName.toLowerCase().includes(term)
          || pipe.transform(request.id).includes(term);
    });
  }
  openModal(patch, i){
    if(patch === 'info'){
      const modalRef = this.modalService.open(ResourceModalComponent, { size: 'lg', centered: true, scrollable: true });
      modalRef.componentInstance.resources = this.request[i];
  }
    else if(patch === 'employee'){

      this.getUser(i);
  }
}
  getRequest(){
    this.handleRequest = this.service.getAll(this.condition)
    .subscribe((x: any) =>{
      this.request = x;
     this.collectionSize = x.length;
    this.refreshRequest();
      console.log('x => ', x);
      });
    }
    getUser(id){
      this.handleUser = this.userService.getById(id)
      .subscribe(x =>{
        const modalRef = this.modalService.open(NgbdModalComponent, { size: 'xl' });
        modalRef.componentInstance.user = x;
        }, 
         e => {
           this.alertService.error('Error, usuario no inicializado :(');

        } );
    }

  refreshRequest() {
  return  this.request = this.request
      .map((request, i) => ({id: i + 1, ...request}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  ngOnDestroy(): void {
    this.handleRequest.unsubscribe();
    if( this.handleUser){
      this.handleUser.unsubscribe();
    }

  }
}
