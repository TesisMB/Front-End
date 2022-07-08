import { AlertService } from './../../services/_alert.service/alert.service';
import { MonitoreoService } from './../../monitoreo/monitoreo.service';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { Files } from 'src/app/models/monitoreos';
const TITLE = 'Ultimos reportes';

@Component({
  selector: 'recent-monitoreo',
  templateUrl: './recent-monitoreo.component.html',
  styleUrls: ['./recent-monitoreo.component.css']
})
export class RecentMonitoreoComponent implements OnInit {
  title = TITLE;
  isLoading = true;
  files: Files[] = [];
  handle: Subscription;
  error: any;
  request : any[] = [
    {level: 1},{level:2},{level:3}];

  constructor(public service: MonitoreoService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.handle = this.service.getAll('2')
    .subscribe(
      (data: Files[]) => {
        this.files = data;
        this.isLoading = false;
      },
      (err) => {
        this.error = err;
        this.isLoading = false;
      }
    );
  }
download(fileName: string, download: boolean){
this.service.getFiles(fileName).subscribe(
  (data) => {
    const file = new Blob([<any>data], {type: 'application/pdf'});
      const fileURL = window.URL.createObjectURL(file);
      download ? saveAs(file, fileName) :  window.open(fileURL, fileName);     
  },
  (err) => {
    this.error = err;
  }
)
}
}
