import { Subscription } from 'rxjs';
import { AlertService } from './../../services/_alert.service/alert.service';
import { ResourcesService } from './../resources.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Resource } from 'src/app/models';
const TABS = ['materiales', 'medicamentos', 'vehiculos'];

@Component({
  selector: 'stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit, OnDestroy {

  tabs = TABS;
  condition: boolean = false;
  type: string = 'materiales';
  handleRequest: Subscription;

  constructor(
    public service: ResourcesService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.service._setType(this.type);
    this.getResources();
    
  }

  changeCondition(event){
     this.type =  event.tab.textLabel.toLowerCase();
     console.log('Tab cambiada', this.type);
      this.service._setType(this.type);
      this.getResources();
  }

  getResources(){
    this.handleRequest = this.service.getAll()
    .subscribe((x: Resource[]) =>{
    const resourcesFilters = x.filter(x => x.availability !== this.condition)
    this.service.uploadTable(resourcesFilters);
    //this.service._setType(type);
      console.log('x => ', resourcesFilters );
    },
  e => {
    this.alertService.error('Ups..! error inesperado, vuelva a intentar mas tarde', {autoClose: true});
  
  } );
  }
  onShow(event){
    this.condition = event.checked;
    this.getResources()
    console.log('Evento => ', this.condition);
  }
  ngOnDestroy(): void {
      this.handleRequest.unsubscribe();
  }
}
