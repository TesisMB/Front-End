import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services';
const patch = 'estates'

@Injectable({
  providedIn: 'root'
})
export class StatesService extends DataService {
  constructor(http: HttpClient) { 
    super(http, patch)
  }
}
