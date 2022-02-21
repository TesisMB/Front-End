import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'src/app/services';

@Injectable({
  providedIn: 'root'
})
export class MedicineService extends DataService {

  constructor(http: HttpClient) { 
    super(http, 'medicines')
  }

}
