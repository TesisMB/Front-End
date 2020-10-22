import { User } from './../models/user';
import { environment } from '../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';



export class DataService {
  private options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private router: Router;
  constructor(private http: HttpClient,private url:string) {

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User
  {
    return this.currentUserSubject.value;
}



  login(userDni:string, userPassword:string) {
    return this.http.post<User>(environment.URL+this.url , { userDni, userPassword })
        .pipe(map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
        }

        return user;
    }));
}

logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
}



  getAll(){
    return this.http.get(environment.URL+this.url);
  }
  get(url:string){
    return this.http.get(environment.URL+url);
  }
  getById(id: string) {
    return this.http.get<User>(environment.URL+this.url+'/'+id);
}
  register(resource){
    return  this.http.post(environment.URL+this.url, JSON.stringify(resource), this.options);
  }

  update(resource){
    return  this.http.put(environment.URL+this.url, JSON.stringify(resource), this.options);
  }
  userUpdate(id, params) {
    return this.http.patch(environment.URL+this.url+'/'+id, params)
        .pipe(map(x => {
            // update stored user if the logged in user updated their own record
            if (id == this.currentUserValue.userID) {
                // update local storage
                const user = { ...this.currentUserValue, ...params };
                localStorage.setItem('currentUser', JSON.stringify(user));

                // publish updated user to subscribers
                this.currentUserSubject.next(user);
            }
            return x;
        }));
}

  delete(id){
    return this.http.delete(environment.URL+this.url+'/'+id)
    .pipe(map(x => {
      // auto logout if the logged in user deleted their own record
      if (id == this.currentUserValue.userID) {
          this.logout();
      }
      return x;
  }));
  }
}
