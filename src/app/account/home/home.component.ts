import { SignalRService } from './../../services/_signal-r.service/signal-r.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private hubService: SignalRService) {
  }

  ngOnInit() {

    this.hubService.notificacion.subscribe(notif => {
       console.log('****Recepción del mje****'); 
      console.log(notif);
    });
  }
}
