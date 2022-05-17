import { AuthenticationService } from 'src/app/services';
import { AlertService } from './../../services/_alert.service/alert.service';
import { ResourcesService } from './../resources.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, QueryList, OnInit, ViewChildren, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Resource } from 'src/app/models';
import { filter } from 'rxjs/operators';
import { TableService } from 'src/app/services/_table.service/table.service';
import { Observable, Subscription } from 'rxjs';
import {SorteableDirective, SortEvent} from '../../directives/sorteable.directive';

@Component({
  selector: 'resources-list',
  templateUrl: './resources-list.component.html',
  styleUrls: ['./resources-list.component.css'],
})
export class ResourcesListComponent implements OnInit, OnDestroy {
  tipo: string = null;
  data:Observable<Resource[]>;
  total$: Observable<number>;
  handlerGetAll: Subscription;
  error: any = '';

  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;
  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    public service: ResourcesService,
    private location: Location,
    private authService: AuthenticationService
  ) {

    //this.tipo = this.route.snapshot.params.tipo;
    //console.log('Tipo constructor: ',this.tipo);
    this.data = this.service.resources$;
    this.total$ = this.service.total$;


  }

  ngOnInit(): void {
    this.getParams();

  }

  get availabilityItem(){

    return;
  }
  getAllItems() {
    this.handlerGetAll = this.service.getAll(this.authService.currentUserValue.userID)
    .subscribe(
      (data) => {
        console.log('Datos: ',data);   

      },
      (err) => {
        this.error = err;
        this.alertService.error('Error al cargar los datos', {
          autoClose: true,
        });
      }
    );
  }

  getParams() {
    this.route.params.subscribe((params: Params) => {
      this.tipo = params.tipo;
      this.service._setType(params.tipo);
      this.getAllItems();
      console.log('Tipo getParams: ',this.tipo);
    });
  }
  onBack() {
    this.location.back();
  }

  // onSort({column, direction}: SortEvent) {
  //   // resetting other headers
  //   this.headers.forEach(header => {
  //     if (header.sortable !== column) {
  //       header.direction = '';
  //     }
  //   });

  //   this.service.sortColumn = column;
  //   this.service.sortDirection = direction;
  // }
  ngOnDestroy(){
    this.handlerGetAll.unsubscribe();
    this.service.destroyResources();
    console.log('Destroy executing...');
  }
}
