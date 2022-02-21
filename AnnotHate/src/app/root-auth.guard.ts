import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class RootAuthGuard implements CanActivate {

  constructor(private utilsService: UtilsService,
              private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.utilsService.userSignedIn()) {
      this.router.navigate(["signin"]);
    } else {
      const userEmail = this.utilsService.getUser().email;
      if ((userEmail != 'aydinabiar@gmail.com') && (userEmail != 'gilbert.badaro@gmail.com')){
        this.router.navigate(["dataset"])
      }
    }

    return true;
  }
  
}
