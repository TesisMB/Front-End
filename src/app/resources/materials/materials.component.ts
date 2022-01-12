import { ResourcesService } from './../resources.service';
import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Resource } from 'src/app/models';

const TITLES = [
{label: 'Nombre',               value:""},
{label: 'Cantidad',             value:''},
{label: 'Fecha de vencimiento', value:''},
{label: 'Laboratorio',          value:''},
{label: 'Droga',                value:''},
{label: 'Peso',                 value:''},
{label: 'Utilidad',             value:''}
]
@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css'],
})
export class MaterialsComponent implements OnInit {
  id: number = null;
  type: string = null;
  item: Resource = null;
  handler: any;
  error: any = '';
  titles = TITLES;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private service: ResourcesService
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params.id;
    this.type = this.route.snapshot.params.tipo;

    this.getParams();
    this.getItems();
  }
  get availability(){
    return this.item.volunteers ? this.item.volunteers.status : this.item.availability;
  }

  getParams() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.type = params.tipo;
      console.log(this.id);
      console.log(this.type);

      if ((params.id || params.tipo) == 'undefined' || null) {
        this.router.navigate(['**']);
      }
    });
  }

  onBack() {
    this.location.back();
  }

  getItems() {
    this.handler = this.service.getById(this.id, this.type).subscribe(
      (data) => {
        this.item = data;
        console.log(this.item);
      },
      (err) => {
        this.error = err;
      }
    );
  }

  requestItem(){
    console.log('Item solicitado...');
  }
}
