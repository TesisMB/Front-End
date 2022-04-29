import { environment } from './../../environments/environment';
import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})

export class PlacesApiClient extends HttpClient{

    public baseUrl: string = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

    constructor(handler: HttpHandler){
        super(handler);
    }

    public override 
    get<T>(url: string, 
        options: {params?: HttpParams | {
        [param: string]: string | string[];
    };
    })
    {

        url = this.baseUrl + url;

        return super.get<T>(url, {
            params: {
                country: 'ar',
                limit: '2',
                language: 'es',
                /* types: 'place,neighborhood', */
                access_token:  environment.key,
                ...options.params
            }
        });
    }
}