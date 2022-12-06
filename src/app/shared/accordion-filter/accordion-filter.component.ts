import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResult } from 'src/app/models';
import { ReportService } from 'src/app/services/_report.service/report.service';
import { FromUtcPipe } from 'ngx-moment';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'accordion-filter',
  templateUrl: './accordion-filter.component.html',
  styleUrls: ['./accordion-filter.component.css']
})
export class AccordionFilterComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

 @Input() searchTerm: any;
 @Input() route: string;
 @Output() searchTermEvent = new EventEmitter<string>();
 @Output() searchTypeEvent = new EventEmitter<string>();
 isDisabled: boolean = true;
  constructor(
    public service: ReportService,
    private routes: Router,
    // private formBuilder : FormBuilder

  ) {
    // this.searchTearm = this.formBuilder.group({
    //   value: ['']
    // });
   }

  ngOnInit(): void {

  }

//   ngOnChanges(changes: SimpleChanges) {
//   console.log(changes.service.currentValue);

//   this.searchTerm.emit(changes.service.currentValue);
        
//     this.doSomething(changes.categoryId.currentValue);
//     You can also use categoryId.previousValue and 
//     categoryId.firstChange for comparing old and new values
    
// }
search(value: string){
  console.log(value);
  this.searchTermEvent.emit(value);
}

changeToReport(value: string){
  // this.searchTypeEvent.emit(value)
  const searchType =  this.service.searchType;
  this.service.searchType = value;
}

navigateTo(){
  console.log(this.routes.url);
}

manageAccordion() {
  if (this.isDisabled) {
    console.log('Open');
    this.accordion.openAll();
    this.isDisabled = false;
  } else if (!this.isDisabled) {
    this.accordion.closeAll();
    console.log('Close');
    setTimeout(x => { this.isDisabled = true; }, 1000);


  }
}
}
