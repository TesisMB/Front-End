import { DataService } from './../../services/data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourcesService } from '../resources.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService extends DataService {

  constructor(http: HttpClient) { 
    super(http, 'materials')
  }
}
