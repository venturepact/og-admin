import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoggedIn} from './../../shared/interfaces/logged-in.interface';
import {LoggedInService} from './../../shared/services/logged-in.service';
import {SubDomain} from './../../shared/interfaces/subdomain.interface';

@Component({
  selector: 'app-home',
  template: `
  `
})

export class HomeComponent implements OnInit {
  loggedIn: LoggedIn;

  constructor(public loggedInService: LoggedInService,
              public router: Router) {
    this.loggedIn = loggedInService.loggedIn;
  }

  ngOnInit() {
    this.router.navigate(['login']);
    if (this.loggedIn.isLoggedIn) {
      this.router.navigate(['/admin/companies']);
    }
  }

}
