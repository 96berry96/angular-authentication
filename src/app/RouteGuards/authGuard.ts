import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable, map, take } from "rxjs";

export const canActivate:CanActivateFn = (router: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> | UrlTree => {
  const authService = inject(AuthService);
  const route = inject(Router);

  return authService.user.pipe(take(1), map((user) => {
    const loggedin = user ? true : false;

    if(loggedin){
      return true;
    } else {
      return route.createUrlTree(['/login']);
    }
  }))
}