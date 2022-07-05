import { User } from './../models/user';
import { AuthenticationService } from './_authentication/authentication.service';
import { environment } from '../../environments/environment';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Operation } from 'fast-json-patch';
import * as _ from 'lodash';
import { Observable, throwError } from 'rxjs';

export class DataService {
  protected options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
    params: new HttpParams() 
  };


  constructor(
    protected http: HttpClient,
    protected patch: string,
    protected authenticateService?: AuthenticationService
  ) {}

  //getAll me traera errores si lo utilizo para otro tipo,
  // ya que this.object es utilizado para la tabla empleados.
  getAll(limit?: string ) {
    if(limit){
    let paramaters = new HttpParams().append('limit', limit);
    this.options.params = paramaters;
  }
    return this.http.get<any>(
      environment.URL + this.patch,
      this.options
      );
  }

  getById(id: number) {
    return this.http.get<any>(environment.URL + this.patch + '/' + id);
  }
  register(resource) {
    return this.http.post(
      environment.URL + this.patch,
      JSON.stringify(resource),
      this.options
    );
  }

  update(resource) {
    return this.http.put(
      environment.URL + this.patch,
      JSON.stringify(resource),
      this.options
    );
  }
  userUpdate(id, operations: Operation[], params?) {
    return this.http
      .patch(environment.URL + this.patch + '/' + id, operations, this.options)
      .pipe(
        map((x) => {
          // update stored user if the logged in user updated their own record
          if (id == this.authenticateService.currentUserValue.userID) {
            // update local storage

            const user = _.pick(
              params,
              _.keys(this.authenticateService.currentUserValue)
            );
            console.log(user);
            localStorage.setItem('currentUser', JSON.stringify(user));

            // publish updated user to subscribers
            this.authenticateService.setCurrentUser(user);
          }
          return x;
        })
      );
  }

  delete(id) {
    return this.http
      .delete(environment.URL + this.patch + '/' + id, this.options)
   .pipe(
        map((x) => {
          if (id == this.authenticateService.currentUserValue.userID) {
            this.authenticateService.logout();
          }

          console.log("currentUserValue: ", this.authenticateService.currentUserValue.userID);

          return x;
        })
      ); 
  }


  generatePDF(id): Observable<any> {
    const headers = new HttpHeaders().set('Accept','application/pdf');
    return this.http.get(environment.URL + this.patch + '/' + id, 
        {
          headers: headers,
          responseType: 'blob'
        }
      );
    }
  
 

  private handleError(err) {  
    let errorMessage: string;  
    if (err.error instanceof ErrorEvent) {  
      errorMessage = `An error occurred: ${err.error.message}`;  
    } else {  
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;  
    }  
    console.error(err);  
    return throwError(errorMessage);  
  }  
}
