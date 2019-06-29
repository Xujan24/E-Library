import { UserAuthService } from '../services/user-auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * @description
 * CanActivate guard to verify if the user email has been verified or not. true if verfied; false otherwise.
 */

@Injectable({
  providedIn: 'root'
})
export class VerifyGuard implements CanActivate {

  constructor(
    private userAuth: UserAuthService,
    private router: Router
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
       this.userAuth.isUserVerified().then(isVerified => {
         console.log('verified guard', isVerified)
         if (!isVerified){
           this.router.navigate(['/verify']);
           return false;
         }
       });

       return true;

  }
  
}
