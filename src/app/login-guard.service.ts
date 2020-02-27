import { Injectable } from '@angular/core';
import {CanActivate,ActivatedRouteSnapshot,Router} from '@angular/router';
import {Cookie} from 'ng2-cookies/ng2-cookies';
@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(private Router:Router) { }
  canActivate(route:ActivatedRouteSnapshot):boolean{
    if(!Cookie.get('authtoken') )
    {
       
           
           return true;
    }
    else{
      this.Router.navigate(['/dashboard'])
             return false;

    }
  
  }

}
