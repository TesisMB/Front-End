import { AuthenticationService } from 'src/app/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Resource } from '../models';
import { filter, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResourcesService {
 private _resources$ = new BehaviorSubject<Resource[]>([]);
  constructor(
    private http: HttpClient,
    private service?: AuthenticationService
  ) {}

  get resources$(){return this._resources$.asObservable();}

  getAll(patch: string) {
    return this.http
      .get<Resource[]>(environment.URL + patch)
       .pipe(map((resources: Resource[]) => {
          if(resources.length> 0){
            this._resources$.next(resources);
          }
          else{
            this._resources$.next(null);
          }
          return resources;
       }
       ));
  }

  getById(id: number, patch: string) {
    return this.http.get<any>(environment.URL + patch + '/' + id);
  }
  register(resource, patch: string) {
    return this.http.post(environment.URL + patch, JSON.stringify(resource));
  }
  update(resource, patch: string) {
    return this.http.put(environment.URL + patch, JSON.stringify(resource));
  }

  delete(id, patch: string) {
    return this.http.delete(environment.URL + patch + '/' + id);
  }
}
