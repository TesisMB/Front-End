import { AuthenticationService } from 'src/app/services';

import { Component, OnInit, OnDestroy} from '@angular/core';
@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy{
  ubication: string = "";
  constructor(private _authenticationService: AuthenticationService) {}

  ngOnInit() {    
       this.ubication = this._authenticationService.currentUserValue.estates.locationCityName;
}
  ngOnDestroy(){}
}
