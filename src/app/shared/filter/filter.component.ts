import { Observable } from 'rxjs';
import { StatesService } from 'src/app/resources/states/states.service';
import { ReportService } from 'src/app/services/_report.service/report.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
locations : Observable<any> = new Observable<any>();
hasAvailability: Observable<boolean>;
hasDonation: Observable<boolean>;

  constructor(public service: ReportService, private stateService: StatesService ) { 
    this.locations = stateService.getAll();
    this.hasAvailability = service.hasAvailability$;
    this.hasDonation = service.hasDonation$;
  }

  ngOnInit(): void {
    this.locations = this.stateService.getAll();
    this.hasAvailability = this.service.hasAvailability$;
    this.hasDonation = this.service.hasDonation$;
  }

}
