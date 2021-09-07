import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class ResourcesService  {

  constructor(private http: HttpClient, protected patch:string,) {

   }


   getAll(){
    return this.http.get<any>(environment.URL+this.patch);
    
  }

  getById(id: number) {
    return this.http.get<any>(environment.URL+this.patch+'/'+id);
}
  register(resource){
    return  this.http.post(environment.URL+this.patch, JSON.stringify(resource));
  }
  update(resource){
    return  this.http.put(environment.URL+this.patch, JSON.stringify(resource));
  }

  delete(id) {
    return this.http.delete(environment.URL+this.patch+'/'+id);
     }
}
