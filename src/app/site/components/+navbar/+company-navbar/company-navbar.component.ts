import { Component } from '@angular/core';
import { LoggedIn } from '../../../../shared/interfaces/logged-in.interface';
import {LoggedInService} from '../../../../shared/services/logged-in.service';
import {CookieService} from '../../../../shared/services/cookie.service';

/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'company-navbar',
  templateUrl: './company-navbar.component.html',
  styleUrls: ['./company-navbar.component.css'],
})

export class CompanyNavbarComponent {
  loggedIn: LoggedIn;
  username: String;
  showLogin:Boolean = false;

  constructor(
    public loggedInService: LoggedInService,
    public _cookieService:CookieService
  ) {
    let url = window.location.hostname;
    let url_array = url.split('.');
    if(url_array.length === 3) {
      this.showLogin = true;
    }
    this.loggedIn = loggedInService.loggedIn;
    let storage : any = _cookieService.readCookie('storage');
    if(storage !== null) {
      storage = JSON.parse(storage);
      // console.log(storage.user.username);
      this.username = storage.user.username;
    }
  }

}
