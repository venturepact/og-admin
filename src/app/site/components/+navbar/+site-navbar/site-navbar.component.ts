import { Component } from '@angular/core';
import { LoggedIn } from '../../../../shared/interfaces/logged-in.interface';
import {LoggedInService} from '../../../../shared/services/logged-in.service';
import {CookieService} from '../../../../shared/services/cookie.service';

/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'site-navbar',
  templateUrl: './site-navbar.component.html',
  styleUrls: ['./site-navbar.component.css'],
})

export class SiteNavbarComponent {
  loggedIn: LoggedIn;
  username: String;
  showLogin:Boolean = false;

  constructor(
    public loggedInService: LoggedInService,
    public _cookieService:CookieService
  ) {
    // console.log(window.location.hostname);
    let url = window.location.hostname;
    let url_array = url.split('.');
    if(url_array.length === 3) {
      this.showLogin = true;
    }
    this.loggedIn = loggedInService.loggedIn;
    let storage : any = _cookieService.readCookie('storage');
    if(storage !== null) {
      storage = JSON.parse(storage);
      this.username = storage.user.username;
    }
  }

}
