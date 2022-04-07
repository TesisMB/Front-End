import { ResourcesRequestGet } from './../../models/resources.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'list-resources',
  templateUrl: './list-resources.component.html',
  styleUrls: ['./list-resources.component.css']
})
export class ListResourcesComponent implements OnInit {
@Input() resources: ResourcesRequestGet[] = [];
materials = [];
medicines = [];
vehicles = [];


  constructor() {
   }

  ngOnInit(): void {

    this.materials = this.resources.filter(m => m.materials);
    this.medicines = this.resources.filter(m => m.medicines);
    this.vehicles =this.resources.filter(m => m.vehicles);
    console.log('Lista de materiales => ',this.materials);
    console.log('Lista de medicinas => ',this.medicines);
    console.log('Lista de vehiculos => ',this.vehicles);
  }


}
