import { AuthenticationService } from './../../services/_authentication/authentication.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { UserService } from 'src/app/users';

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
  constructor(private service: AuthenticationService,
    private userService: UserService,
    ) { }

  ngOnInit(): void {
      this.currentUser =  this.service.currentUserValue;
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


  generatePDF(){ 

    console.log(this.currentUser);
    //let fileName = `${this.user.users.persons.firstName} ${this.user.users.persons.lastName}`;
      let fileName = `${this.currentUser.persons.firstName} ${this.currentUser.persons.lastName}`;
      this.userService.generatePDFCredential(this.service.currentUserValue.userID).subscribe(res => {
        const file = new Blob([<any>res], {type: 'application/pdf'});
      //  saveAs(file, fileName);
        const fileURL = window.URL.createObjectURL(file);
        window.open(fileURL, fileName);
      });
    }
  
  ngOnDestroy(){
     this.handle.unsubscribe();
  }

}
