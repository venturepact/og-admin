import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {LoggedIn} from './../../../shared/interfaces/logged-in.interface';
import {environment} from '../../../../environments/environment';
import {LoggedInService} from '../../../shared/services/logged-in.service';
import {CookieService} from '../../../shared/services/cookie.service';
import {UserService} from '../../../shared/services/user.service';
import {AdminService} from "../../../shared/services/admin.service";

declare var jQuery: any;
@Component({
  selector: 'og-toolbar',
  templateUrl: './toolbar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './toolbar.component.css'
  ]
})

export class ToolbarComponent implements OnInit {
  loggedIn: LoggedIn = {isLoggedIn: false};
  username: String;
  sub_role: String = null;
  subDomainExt: any;
  currentUrl: any;
  myCompanies: any;
  ngOnInit() {
    jQuery.material.init();
    this.currentUrl = '';
    this.subDomainExt = '.' + environment.APP_EXTENSION;
  }

  constructor(public loggedInService: LoggedInService,
              public _userService: UserService,
              public router: Router,
              public _cookieService: CookieService,
              public _adminService: AdminService) {
    this.loggedIn = loggedInService.loggedIn;
    if (_cookieService.readCookie('storage')) {
      let storage = JSON.parse(_cookieService.readCookie('storage'));
      this.loggedIn = {isLoggedIn: true}
      this.username = storage.user.username;
      this.sub_role = storage.user.sub_role;
    }
  }

  onLogout() {
    if (this._userService.logout()) {
      this.loggedInService.logout();
      this.router.navigate(['/']);
    }
  }
}
