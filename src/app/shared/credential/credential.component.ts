import { AuthenticationService } from './../../services/_authentication/authentication.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models';
import { Observable, Subscriber, Subscription } from 'rxjs';

const TITLE = 'Credencial Digital';

@Component({
  selector: 'credential',
  templateUrl: './credential.component.html',
  styleUrls: ['./credential.component.css']
})
export class CredentialComponent implements OnInit {
title = TITLE;
// @Input() currentUser;
isLoading = true;
currentUser: any;
handle: Subscription;
msj: string;
error: any;
  constructor(private service: AuthenticationService) { }

  ngOnInit(): void {
  //  this.currentUser =  this.service.currentUserValue;
      this.handle = this.service.currentUser2
      .subscribe(x =>{
        this.currentUser = x;
        this.isLoading = false;

           },
         e => {
          this.isLoading = false;
          this.error = e;
          this.msj = 'Ha ocurrido un error :(, vuelva a intentarlo mas tarde';
        } );
    
  }

  ngOnDestroy(){
     this.handle.unsubscribe();
  }

}
