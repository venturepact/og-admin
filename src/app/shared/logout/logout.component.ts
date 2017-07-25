import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from './../../../environments/environment';
import {UserService} from '../services/user.service';
import {LoggedInService} from '../services/logged-in.service';

declare var jQuery: any;
declare var ga: any;

// declare var _kmq:any;

@Component({
  selector: 'og-logout',
  template: ''
})
export class LogoutComponent implements OnInit {

  constructor(public _userService: UserService,
              public router: Router,
              public loggedInService: LoggedInService) {
  }

  ngOnInit() {
    // console.log("inside logout component");
    if (this._userService.logout()) {
      this.loggedInService.logout();
      this.router.navigate(['/']);
    }
  }

}
