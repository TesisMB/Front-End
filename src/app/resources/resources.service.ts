import { AuthenticationService } from 'src/app/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Resource } from '../models';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ResourcesService {
  constructor(
    private http: HttpClient,
    private service?: AuthenticationService
  ) {}

  getAll(patch: string) {
    return this.http
      .get<Resource[]>(environment.URL + patch);
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
