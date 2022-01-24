import { Resource } from './../../models/resources.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from './../../services/data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourcesService } from '../resources.service';
import { TouchSequence } from 'selenium-webdriver';
import { Request } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService extends DataService {
  private requestSubject : BehaviorSubject<any>;
  public _request: Observable<any>;
  private request: Request = null;

  constructor(http: HttpClient) { 
    super(http, 'materials')
    this.requestSubject = new BehaviorSubject<Request>
    (JSON.parse(localStorage.getItem('cart')));

    this._request = this.requestSubject.asObservable();
  }

  get getCartRequest(): Request {
    const req: Request =  (JSON.parse(localStorage.getItem('cart')));
      if(req !== this.requestSubject.value) {
        this.requestSubject.next(req);
      }
    return this.requestSubject.value; 
  }

  public setRequest(items: Request){
    let mapRequest;
    (this.request) ? this.request = this.requestSubject.value : this.request = items;

   const isAdd = this.request.request.some(res => 
    (res.resource.id === items.request[0].resource.id && res.resource.name === items.request[0].resource.name)
     ? true : false);

   console.log('Probando isAdd: ', isAdd);

    if(isAdd){
      mapRequest = this.request.request.map(res => {
              (res.resource.id === items.request[0].resource.id && res.resource.name === items.request[0].resource.name)
              ? items.request[0].quantity += res.quantity : console.log('No es igual...');
            });

            console.log('mapRequest: ',mapRequest);
        } 

    if(this.request.request != items.request && isAdd === false){ 
     this.request.request.push(...items.request);
    }

  const cart = (JSON.stringify(this.request));
  localStorage.setItem('cart', cart);
  this.requestSubject.next(this.request);    

  }
}
