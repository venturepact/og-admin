import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

@Injectable()
export class CompanyProfileRouteGuard implements CanActivate {
  constructor(public router: Router) {}

  canActivate() {
    let url = window.location.hostname;
    let url_array = url.split('.');
    // console.log(url_array.length);
    if(url_array.length !== 3) {
      // console.log('In');
      this.router.navigate(['/']);
    }
    return true;
  }
}
