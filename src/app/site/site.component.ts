import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubDomain } from './../shared/interfaces/subdomain.interface';
import { environment } from '../../environments/environment';
import { Script } from '../shared/services/script.service';
import { Title } from '@angular/platform-browser';
import {FeatureAccess} from '../shared/interfaces/features.interface';
import {SubDomainService} from '../shared/services/subdomain.service';
import {CookieService} from '../shared/services/cookie.service';
import {FeatureAuthService} from '../shared/services/feature-access.service';

declare var jQuery: any;

@Component({
  selector: 'og-site',
  template: `
    <sd-toolbar *ngIf="showToolbar"></sd-toolbar>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit, OnDestroy {
  subDomain: SubDomain;
  intercom_id: string = environment.INTERCOM_ID;
  storage: any;
  showToolbar: Boolean = false;
  constructor(public subDomainService: SubDomainService,
    public _cookieService: CookieService,
    public _featureAuthService: FeatureAuthService,
    public router: Router,
    public _script: Script,
    public titleService: Title,
  ) {
    this.showToolbar =  ( _cookieService.readCookie('storage') != null );
    titleService.setTitle("Outgrow Home");
    this.subDomain = subDomainService.subDomain;
  }

  ngOnInit() {
    //Intercom
  }

  ngOnDestroy() {
  }
}
