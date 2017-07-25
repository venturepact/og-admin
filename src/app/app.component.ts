import {Component, OnDestroy, OnInit} from '@angular/core';
import {Script} from './shared/services/script.service';
import {CookieService} from './shared/services/cookie.service';
import {environment} from "../environments/environment";

declare var window: any;
declare var jQuery: any;

@Component({
  selector: 'sd-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  cookie: any;
  storage: any;
  url: any;
  root_url: boolean;

  constructor(public _script: Script,
              public _cookieService: CookieService) {
  }

  ngOnInit() {
    console.log('%cSTOP!.', ' color: red; font-size: xx-large');
    console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature, it is a scam and will give them access to your account.', 'color: grey; font-size: x-large');

    this.cookie = this._cookieService.readCookie('storage');

    this.storage = this.cookie != null ? JSON.parse(this.cookie) : '';

    let url = window.location.href;
    let routeObject = url.split('/');
    if (routeObject[3] == 'logout')
      return true;
    if (this.cookie != null) {
      if (this.storage.user.role === 'ADMIN' && routeObject[3] !== 'admin') {
        window.location.href = environment.PROTOCOL + environment.PARENT_APP_DOMAIN + '/admin';
      }
    }

    if (environment.production) {
      console.log = function () {
      }
    }
  }

}

