import { Component,ViewEncapsulation } from '@angular/core';
import {CookieService} from "../../shared/services/cookie.service";

@Component({
  selector: 'og-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent {
  sub_role: String = null;
  constructor(public _cookieService: CookieService) {
    if (_cookieService.readCookie('storage')) {
      let storage = JSON.parse(_cookieService.readCookie('storage'));
      this.sub_role = storage.user.sub_role;
    }
  }
}
