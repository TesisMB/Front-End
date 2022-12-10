import { Observable, Subscription } from 'rxjs';
import { EmergencyDisasterService } from './../../emergency-disaster/emergency-disaster.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services';

const TITLE = 'Últimas alertas';

@Component({
  selector: 'recent-alert',
  templateUrl: './recent-alert.component.html',
  styleUrls: ['./recent-alert.component.css']
})
export class RecentAlertComponent implements OnInit {
  title = TITLE;
  alerts = null;
  isLoading = true;
  handle: Subscription;
  constructor(public service: EmergencyDisasterService, private authService: AuthenticationService) { }

  ngOnInit(): void {

    this.handle = this.service.getAllWithoutFilter('2')
    .subscribe(data => {
      this.alerts = data;
      this.isLoading = false;

    },
    e => {
      this.isLoading = false;
    });
  }

  getCardColor(state: number){
    if(state === 3){
      return '#FADBD8';
    }
    else if(state === 2){
      return '#FCF3CF';
    }
    else{
      return '#D5F5E3';

      }
  }

}
