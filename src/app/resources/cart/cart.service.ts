import { DataService } from 'src/app/services';
import { Resource } from '../../models/resources.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from 'src/app/models';
import { environment } from 'src/environments/environment';
import { ResourcesService } from '../resources.service';

@Injectable({
  providedIn: 'root'
})
export class ResourcesDetailsService extends DataService {
  private requestSubject : BehaviorSubject<any>;
  public _request: Observable<any> = null;
  private request: Cart = null;

  constructor(http: HttpClient) { 
    super(http, 'materials')
    this.requestSubject = new BehaviorSubject<Cart>
    (JSON.parse(localStorage.getItem('cart')));
  //  this.request = ;
    this._request = this.requestSubject.asObservable();
  }

  get getCartRequest(): Cart {
    const req: Cart = (JSON.parse(localStorage.getItem('cart')));
      if(req !== this.requestSubject.value) {
        this.requestSubject.next(req);
      }
    return this.requestSubject.value; 
  }

  public setRequest(items: Cart){
    this.request = this.requestSubject.value;

    let mapRequest = [];
    let resourceId = items.request[0].resource.id;
    let resourceName = items.request[0].resource.name;
    let resourceQuantity = items.request[0].quantity;
    
    if(this.request)  {
    const timestamp = this.request.createDate;
    const hasSome = this.request.request.some((res) => 
      (res.resource.id == resourceId 
      && res.resource.name == resourceName
      && timestamp != items.createDate ) ?
      true : false);
            
      if(hasSome){
        mapRequest = this.request.request.map(res => {
                (res.resource.id == resourceId && res.resource.name == resourceName)
                ? res.quantity += resourceQuantity : console.log('Item: ' ,res.resource);
              });
  
         } 
        else {
          this.request.request.push(...items.request);
    }
  }
    else this.request = items;

  const cart = (JSON.stringify(this.request));
  localStorage.setItem('cart', cart);
  this.requestSubject.next(this.request);    

  }

  public clearCartRequest(){
    this.requestSubject.next(null);
    localStorage.removeItem('cart');
  }

  updateCart(items:Cart){
    if (items.request.length){
    this.requestSubject.next(items);
    const jsonItems = JSON.stringify(items);
    localStorage.setItem('cart',JSON.stringify(items));
  } else {
  this.clearCartRequest();
  }
}

  postRequest(request){
    return this.http.post(environment.URL + 'ResourcesRequest', request);
  }

  deleteFromCart(index: number){
//*************NO FUNCIONA- REFACTORIZAAR */

  let cart: Cart  = this.requestSubject.value;
  //cart.request.splice(index,1);
  this.updateCart(cart);
  }


}
