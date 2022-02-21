import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            // chequea que las rutas estan restringidas por roles
            if ( route.data.roles && route.data.roles.indexOf(currentUser.roleName) === -1) {
              //Si el rol no esta autorizado redirecciona al Home Page
              //this.router.navigate(['/']);
              return false;
            }
            //Si esta autorizado retorna true.
            return true;
        }
         else {
            // si no esta loggeado, redirecciona a login con el return url.
            this.router.navigate(['/cliente/login'], { queryParams: { returnUrl: state.url }});
            return false;
         } 
    }
}
