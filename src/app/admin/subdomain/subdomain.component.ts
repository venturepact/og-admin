
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {environment} from "../../../environments/environment";
import {Domains} from './../../shared/models/domains';
import {DomainService} from './../../shared/services/domains.service';
import {Script} from '../../shared/services/script.service';
import {CookieService} from "../../shared/services/cookie.service";
import {Router} from "@angular/router";
declare var jQuery:any;

@Component({
  selector: 'og-sub-domains',
  templateUrl: './subdomain.component.html',
  styleUrls: ['./subdomain.component.css', './../jquery.dataTables.min.css'],
})

export class SubDomainComponent implements OnInit , AfterViewInit{
	loading: boolean = false;
	subdomainExtension: string = '';
	PremiumSubDomainForm:FormGroup;
	ReservedSubDomainForm:FormGroup;
	ReservedDomains:Domains[] = [];
	PremiumDomains:Domains[] = [];
	error:boolean = false;
	errorMessage: string = '';
	constructor(public fb:FormBuilder,
		public _domainService:DomainService,
		public _script :Script, public _cookieService: CookieService, public router: Router) {
      if (this._cookieService.readCookie('storage')) {
        let storage = JSON.parse(this._cookieService.readCookie('storage'));
        if(storage.user.sub_role !== null)
          this.router.navigate(['/admin/users']);
      }
	}

	ngOnInit(){
		this.PremiumSubDomainForm = this.fb.group({
			premiumSubdomain: ['',Validators.compose([Validators.required,Validators.minLength(3),Validators.pattern('^[a-zA-Z0-9]*$')])]
		});
		this.ReservedSubDomainForm = this.fb.group({
			reservedSubdomain: ['',Validators.compose([Validators.required,Validators.minLength(3),Validators.pattern('^[a-zA-Z0-9]*$')])]
		});
		this.subdomainExtension = '.' + environment.APP_EXTENSION;
		this.error = false;
		this.errorMessage = '';
	}

	ngAfterViewInit() {
	    this._script.load('datatables')
	        .then((data)=>{
	        })
	        .catch((error)=>{
	        	console.log('Script not loaded', error);
	        });
  	}

	  hideError(){
		this.error = false;
		this.errorMessage = '';
	}

}
