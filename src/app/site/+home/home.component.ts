import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoggedIn} from './../../shared/interfaces/logged-in.interface';
import {LoggedInService} from './../../shared/services/logged-in.service';
import {SubDomain} from './../../shared/interfaces/subdomain.interface';
import {SubDomainService} from './../../shared/services/subdomain.service';

@Component({
  selector: 'app-home',
  template: `
  `
})

export class HomeComponent implements OnInit {

  subDomain: SubDomain;
  loggedIn: LoggedIn;

  constructor(public subDomainService: SubDomainService,
              public loggedInService: LoggedInService,
              public router: Router) {
    this.subDomain = subDomainService.subDomain;
    this.loggedIn = loggedInService.loggedIn;
  }

  ngOnInit() {
    this.router.navigate(['login']);
    if (this.loggedIn.isLoggedIn) {
      this.router.navigate(['/admin']);
    }
  }

}
