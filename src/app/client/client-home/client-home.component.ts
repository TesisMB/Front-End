import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import { User } from 'src/app/models';

import { AuthenticationService } from './../../services/_authentication/authentication.service';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css']
})
export class ClientHomeComponent implements OnInit {
currentUser: User;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
) {
    this.currentUser = this.authenticationService.currentUserValue;
     //Redirecciona si el usuario esta logeado
     if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
    }
}

  ngOnInit(): void {
  }

  login() {
    this.router.navigate(['/cliente/login']);

}


}
