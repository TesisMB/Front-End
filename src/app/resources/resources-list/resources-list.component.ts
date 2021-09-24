import { AuthenticationService } from 'src/app/services';
import { AlertService } from './../../services/_alert.service/alert.service';
import { ResourcesService } from './../resources.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Resource } from 'src/app/models';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'resources-list',
  templateUrl: './resources-list.component.html',
  styleUrls: ['./resources-list.component.css'],
})
export class ResourcesListComponent implements OnInit {
  tipo: string = null;
  data: Resource[] = null;
  handlerGetAll: any;
  error: any = '';
  constructor(
    private location: Location,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private service: ResourcesService,
  ) {
    this.tipo = this.route.snapshot.params.tipo;
  }

  ngOnInit(): void {
    this.getParams();
    this.getAllItems();
  }

  get availabilityItem(){

    return;
  }
  getAllItems() {
    this.handlerGetAll = this.service.getAll(this.tipo)
    .subscribe(
      (data: Resource[]) => {
        this.data = data;
        console.log(this.data);
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
    });
  }
  onBack() {
    this.location.back();
  }
}
