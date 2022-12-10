import { Subscription } from 'rxjs';
import { SignalRService } from './../../services/_signal-r.service/signal-r.service';
import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/services';
import { RoleName, User } from 'src/app/models';
const ROLES_AUTORIZADOS = ['Enc. De logística', 'Coord. General', 'Admin', 'Coord. De Gestión de Riesgo'];

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  handle: Subscription;
  authRoles = ROLES_AUTORIZADOS;
  condition = false;
  currentUser: User = null;
  constructor(
    private authService: AuthenticationService) {
  }

  // get isLogistica () {
  //   return this.currentUser.roleName === RoleName.Logistica;
  //  }
  ngOnInit() {
    this.getCurrentUser();
  //    this.hubService.notificacion.subscribe(notif => {
  //      console.log('****Recepción del mje****');
  //     console.log(notif);
  //   });
   }

   getCurrentUser(){
    this.handle = this.authService.currentUser2
    .subscribe((x:User) =>{
      this.currentUser = x;

      this.condition = this.authRoles.includes(x.roleName);
     },
       e => {
      });
  }
  ngOnDestroy(){
this.handle.unsubscribe();
  }
}


