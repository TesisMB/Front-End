import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService   {
  private options = { headers: new HttpHeaders().set('Content-Type', 'application/json'),
                      params: new HttpParams() };

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public patch = 'login'
  constructor(private http: HttpClient, private router: Router, private modalService: NgbModal) {
    this.currentUserSubject = new BehaviorSubject<User>
    (JSON.parse(localStorage.getItem('currentUser')));

    this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
      const user : User = (JSON.parse(localStorage.getItem('currentUser')));
      if(user !== this.currentUserSubject.value){
            this.currentUserSubject.next(user);
           }
  
      return this.currentUserSubject.value;
  }

  public setCurrentUser(user) {
      this.currentUserSubject.next(user);
  }

   login( userDni, userPassword ) {
       return this.http.post<any>(environment.URL+this.patch, {userDni, userPassword })
           .pipe(map(user => {
             
            // Logea correctamente si existe un token.

            if (user && user.token) {
            // Almacena los datos del usuario y el token en el local Storage para poder navegar entre paginas.
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
            }
              return user;
            }));}
 
   logout() {
    // Elimina el usuario del local Storage y lo declara null.
      localStorage.clear();
      this.currentUserSubject.next(null);
      this.modalService.dismissAll();
      this.router.navigate(['/cliente/login']);
    }
    sendEmail(email:any){
      return this.http.post<any>(environment.URL+'forgot-password', email);
    }
  
    changePassword(token: string, userPassword: string){
      let parametros = new HttpParams().append('token', token);
      this.options.params = parametros;
      return this.http.post<any>(environment.URL+'reset-password/', {userPassword}, this.options);
    }
  }
 
   