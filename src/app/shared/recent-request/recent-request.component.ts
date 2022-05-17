// import { Component, OnInit } from '@angular/core';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Observable, Subscription } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { Resource } from 'src/app/models';
// import { RequestTableService } from 'src/app/resources/request-table/request-table.service';
// import { RequestService } from 'src/app/resources/request/request.service';
// import { AlertService } from 'src/app/services';
// import { UserService } from 'src/app/users';
// const TITLE = 'Ultimas solicitudes pendientes';

// export interface Tile {
//   color: string;
//   cols: number;
//   rows: number;
//   text: string;
// }

// @Component({
//   selector: 'recent-request',
//   templateUrl: './recent-request.component.html',
//   styleUrls: ['./recent-request.component.css']
// })
// export class RecentRequestComponent implements OnInit {
//   title = TITLE;
//   data : any;
//   handle : Subscription;
//   isLoading = false;
//   modalRef:any;


//   constructor(
//     public service: RequestService,
//     private modalService: NgbModal,
//     private requestService: RequestTableService,
//     private userService: UserService,
//     private alertService: AlertService
//     ) { }

//   ngOnInit(): void {
//     this.data = this.service.getAll(,'Pendiente');
//     // this.getLastRequest();
//   }

//   getLastRequest(){
//     this.handle = this.service.getAll()
//     .pipe(
//       tap(data => console.log(data)),
//       // map()
//       )
//       .subscribe(
//         data => {
//           this.data = data;
//         },
//         err => {
//           console.log('Error => ',err);
//         }
//       );
//   }

//   getCurrentUser(){
//     this.
//   }

// }
