import { RoleName } from './../../models/role';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestTableService } from 'src/app/resources/request-table/request-table.service';
import { RequestService } from 'src/app/resources/request/request.service';
import { AlertService, AuthenticationService } from 'src/app/services';
import { UserService } from 'src/app/users';
import { NgbdModalComponent } from 'src/app/users/ngbd-modal/ngbd-modal.component';
import { ResourceModalComponent } from '../resource-modal/resource-modal.component';
@Component({
  selector: 'recent-history',
  templateUrl: './recent-history.component.html',
  styleUrls: ['./recent-history.component.css']
})
export class RecentHistoryComponent implements OnInit {
  @Input() condition; 
  @Input() title = 'Ultimas solicitudes';
  data : any = [];
  handle : Subscription;
  isLoading = true;
  modalRef:any;
  currentRole: RoleName;
  error: any;
  msj: string;
  constructor(
    public service: RequestService,
    private modalService: NgbModal,
    private requestService: RequestTableService,
    private authService: AuthenticationService,
    private alertService: AlertService,
     ) { }

  ngOnInit(): void {
    this.getLastRequest();
  }

  openModal(i){
      const modalRef = this.modalService.open(ResourceModalComponent, { size: 'lg', centered: true, scrollable: true });
      modalRef.componentInstance.resources = this.requestService.requestValue[i];
}




  getLastRequest(){
  const userID =  this.authService.currentUserValue.userID;
    this.handle = this.service.getAll(this.condition, 'solicitud')
    .pipe(
      tap(data => console.log(data)),
      )
      .subscribe(
        data => {
          this.data = data;
          this.requestService._uploadTable(data);
          this.requestService._setCondition(this.condition);
          this.isLoading = false;
    
        },
        err => {
          this.error = err;
          this.msj ='Ha ocurrido un error! Intentelo mas tarde';
          console.log('Error => ',err);
          this.isLoading = false;

        }
      );
  }



}
