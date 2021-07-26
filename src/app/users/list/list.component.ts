import { Employee } from 'src/app/models';
import { AlertService } from './../../services/_alert.service/alert.service';
import { UserService } from '../user.service';
import { Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import { first } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
 import { NgbdModalComponent } from '../ngbd-modal/ngbd-modal.component';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {
  
  users: Employee[];
  userID: number;
  getAllHandler: any;
  error: any= "";

  constructor(private accountService: UserService,
              private alertService: AlertService,
               ) {}

  ngOnInit() {    
   // this.getAllUsers();            
}

  ngAfterViewInit(){}
  

  deleteUser(id: number) {    
      // const user = this.users.find(x => x.userID === id);
      // user.isDeleting = true;
      // this.accountService.delete(id)
      //     .pipe(first())
      //     .subscribe(() => {
      //         this.users = this.users.filter(x => x.userID!== id)
      //    });
  }
test(id: number): void{
  console.log("click en Empleado: " + id);
}
  GetID (id:number) {
    this.userID = id;
  }
// getAllUsers(): void {
//   this.getAllHandler = this.accountService.getAll()
//   .pipe(first())
//   .subscribe((users: Employee[]) => {this.users = users;},
//             error => {this.error = error.message;
//                       this.alertService.error("Error al cargar los datos");
//                       console.log("Error: "+ this.error);});
// }

  ngOnDestroy(){ 
      // this.getAllHandler.unsubscribe();
   }
}
