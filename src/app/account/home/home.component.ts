import { UserService } from './../../users/user.service';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import {AlertService, AuthenticationService } from './../../services';
import { User } from 'src/app/models';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
  
  ) {
  }

  


  ngOnInit() {

  }
}
