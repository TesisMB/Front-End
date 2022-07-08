import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {


  constructor(private http: HttpClient) { }

  sendEmail(email: String){
    return this.http.post<String>(environment.URL+'/Forgot-Password', email);
  }

  changePassword(token, newPassword){
    return this.http.post<any>(environment.URL+'/reset-password/'+token, newPassword);
  }
}
