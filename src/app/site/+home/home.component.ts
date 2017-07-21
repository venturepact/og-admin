import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedIn } from './../../shared/interfaces/logged-in.interface';
import { LoggedInService } from './../../shared/services/logged-in.service';
import { SubDomain } from './../../shared/interfaces/subdomain.interface';
import { SubDomainService } from './../../shared/services/subdomain.service';
@Component({
  selector: 'app-home',
  template: `
    <signup-component *ngIf="!subDomain.is_sub_domain_url && !loggedIn.isLoggedIn"></signup-component>
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
    if ( this.loggedIn.isLoggedIn ) {
      this.router.navigate(['/dashboard']);
    }
  }

}
