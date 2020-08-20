import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

@Injectable({
   providedIn: 'root'
})

export class AuthGuard implements CanActivate, CanActivateChild {

   constructor(private auth: AuthService, private router: Router) { }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
      if (this.auth.isAuthenticated()) {
         return of(true);
      } else {
         this.router.navigate(['/login'], { queryParams: { accessDenied: true } });
         return of(false);
      }
   }

   canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
      return this.canActivate(childRoute, state);
   }

}