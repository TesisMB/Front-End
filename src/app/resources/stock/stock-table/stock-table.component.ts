import { ResourcesService } from './../../resources.service';
import { AlertService } from './../../../services/_alert.service/alert.service';
import { Component, OnInit, OnDestroy, Input, AfterViewInit, ViewChildren, QueryList, ViewEncapsulation } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable, Subscription, pipe } from 'rxjs';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user';
import { Resource } from 'src/app/models';
import { UserService } from 'src/app/users';
import { SorteableDirective } from 'src/app/directives/sorteable.directive';
import { AuthenticationService } from 'src/app/services';
import { filter, first, tap } from 'rxjs/operators';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'stock-table',
  templateUrl: './stock-table.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./stock-table.component.css']
})
export class StockTableComponent implements OnInit {
  @Input() type: string = null;;
  resources$: Observable<Resource[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;
  currentUser: User;
  error: any = '';

  handleRequest: Subscription;
  handleUser: Subscription;
  handleDelete: Subscription;
  handleUpdate: Subscription;
  modalRef:any;
  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
    constructor(
      public service: ResourcesService,
      private alertService: AlertService,
      private modalService: NgbModal,
      private authService: AuthenticationService,
      
      ) {}

  ngOnInit(): void {
    this.resources$  = this.service.resources$;
    this.total$ = this.service.total$;
    this.loading$ = this.service.loading$;
    // this.resources = this.service.resourcesValue;
  }

    get isAdmin(){       
       return this.currentUser.roleName === 'Admin';
      }
      get isCG(){
        return this.currentUser.roleName ===  'Coordinador General';
       }

  ngAfterViewInit(){}

  changeStatus(reason: string, event, id:string){ 
    console.log(event); 
    // this.service.loading(true);
    //Se abre el modal de confirmacion.
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.action = reason;
  
    modalRef.result.then(
      ()=> {
        if (reason ==='Eliminar'){
            this.deleteItem(id);
  }
    else {
      this.updateItem(id)
    }},
    cancel =>{ 
      // this.service.loading(false);
      console.log('Acción cancelada con: ' + cancel);
    }); 
  }
//   openModal(patch, i){
//     if(patch === 'info'){
//       const modalRef = this.modalService.open(ResourceModalComponent, { size: 'lg', centered: true, scrollable: true });
//       modalRef.componentInstance.resources = this.service.requestValue[i];
//   }
//     else if(patch === 'employee'){

//       this.getUser(i);
//   }
// }

    // getUser(id){
    //   this.handleUser = this.userService.getById(id)
    //   .subscribe(x =>{
    //     const modalRef = this.modalService.open(NgbdModalComponent, { size: 'xl' });
    //     modalRef.componentInstance.user = x;
    //     }, 
    //      e => {
    //        this.alertService.error('Error, usuario no inicializado :(', {autoClose: true});

    //     } );
    // }


private deleteItem(id){
  this.handleDelete =  this.service.delete(id,this.type)
  .subscribe(
    resp =>{
       this.alertService.success('Borrado con exito!', {autoClose: true});
      //  this.service.loading(false);
      },
    err => {
      this.alertService.error('El elemento no se ha podido borrar', {autoClose: true});
      // this.service.loading(false);
  });
}

private updateItem(id){
const patch = this.service.changeStatusItem(id);  
this.handleUpdate =  this.service.update(this.type,id,patch )
.pipe(first())
.subscribe(
    data => {
        this.alertService.success('Datos actualizado correctamente', { autoClose: true });
        // this.service.loading(false);
    },
    error => {
      this.alertService.errorForEmployee(error);
      // this.service.loading(false);
    });
}
  ngOnDestroy(): void {
    if( this.handleUser){
      this.handleUser.unsubscribe();
    }

  }
}