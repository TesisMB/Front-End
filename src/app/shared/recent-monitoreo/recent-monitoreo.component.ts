import { Component, OnInit } from '@angular/core';
const TITLE = 'Ultimos reportes';

@Component({
  selector: 'recent-monitoreo',
  templateUrl: './recent-monitoreo.component.html',
  styleUrls: ['./recent-monitoreo.component.css']
})
export class RecentMonitoreoComponent implements OnInit {
  title = TITLE;
  isLoading = false;
  request : any[] = [
    {level: 1},{level:2},{level:3}];

  constructor() { }

  ngOnInit(): void {
  }

}
