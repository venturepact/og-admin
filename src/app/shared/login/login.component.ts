import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EmailValidator } from './../validators/email.validator';
import { environment } from './../../../environments/environment';
import { User, Email} from  './user';
import {Script} from '../services/script.service';
import {MarketingService} from '../services/marketing.service';
import {Title} from '@angular/platform-browser';
import {MembershipService} from '../services/membership.service';
import {CookieService} from '../services/cookie.service';
import {CompanyService} from '../services/company.service';
import {SubDomainService} from '../services/subdomain.service';
import {LoggedInService} from '../services/logged-in.service';
import {UserService} from '../services/user.service';

declare var jQuery: any;
declare var ga: any;
// declare var _kmq: any;
declare var window: any;

@Component({
	selector: 'og-login',
	templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None,
	styleUrls: ['./login.component.css', './../../../assets/css/sahil-hover.css', './../../../assets/css/custom-material.css'],
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: Boolean = false;
  isError: Boolean = false;
  co: any;
  ErrorMsg: String;
  userId: any;
  isDomainExist: Boolean = false;
  resendEmailShow: Boolean = false;
  model = new User(new Email('', true), '');

  isAdminCreated: boolean = false;
  cardStatus:string = '';

  constructor(
    public fb: FormBuilder,
    public _userService: UserService,
    public router: Router,
    public loggedInSerivce: LoggedInService,
    public subDomainService : SubDomainService,
    public _companyService : CompanyService,
    public _cookieService : CookieService,
    public _membershipService:MembershipService,
    public _script: Script,
    public _marketingService: MarketingService,
    public titleService: Title,
    public route: ActivatedRoute) {
      this.route.queryParams.subscribe((params : Params) => {
        if(this.validateEmail(params['email'])){
          this.model.emails.email = params['email'];
        }
      });
      this.titleService.setTitle("Outgrow Home");
        this._script.load('marketing')
          .then((data) => {
            //console.log('Scripts Loaded', data);
            if(data.length && data[0].status == 'Loaded')
              _marketingService.initMarketingStuff();
          })
          .catch((error) => {
            //any error
          });
    }

  ngOnInit() {
    let link = window.location.hostname.split('.');
    if (link[0] === 'app') {
      this.isDomainExist = true;
    }
    let userEmail = localStorage.getItem('leads');
    if (userEmail) {
      this.model.emails.email = userEmail;
    }
    this.loginForm = this.fb.group({
      email: [this.model.emails.email, Validators.compose([
        Validators.required, EmailValidator.format
      ])],
      password: [this.model.password, Validators.compose([
        Validators.required,Validators.minLength(8)
      ])]
    });
    jQuery.material.init();
  }

  validateEmail(email:any) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  hideErrorMessage() {
    jQuery('#is-Error').addClass('hide');
    //this.isError = false;
  }

  onSubmit(value?: any) {
    value = this.loginForm.value;
    let self = this;
    jQuery('#loginSubmit').addClass('loading');
    jQuery('#loginSubmit').html('Please wait');
    jQuery('#loginSubmit').attr('disabled', true);
    let link = window.location.hostname;
    let linkArray = link.split('.');
    //this.co = window.location.href.split('.outgrow')[0].split('//')[1];
    this.co = window.location.href.split('//')[1].split('.')[0];
    let companyName: String = null;
    if (linkArray.length === 3 && linkArray[0] !== 'app')
      companyName = linkArray[0];
    this._userService.login(value.email, value.password, companyName)
      .subscribe((response: any) => {
        //console.log('filepicker_token_set', response.companyAccess);
        if (response.token) {
          self.isAdminCreated = response.user.is_admin_created;
          if(response.user.role !== 'ADMIN'){
            self.cardStatus = response.subscription.currentplan.customer.card_status;
            localStorage.removeItem('leads');
            response.company['cost'] = response.plan.price;
            this.subDomainService.setCurrentCompany(response.company);
          }
          let storage: any;
          if (response.user.role === 'ADMIN') {
            storage = {
              'token': response.token,
              'user': response.user
            };
          } else {
            storage = {
              'token': response.token,
              'user': response.user,
              'currentCompany': response.company.sub_domain,
              'companyList': response.companyList,
              'showUpgradeModal': false,
            };
            // storage.company['cost'] = response.plan.price;
            // console.log('STORAGE JSON', storage.company.cost);
            self._cookieService.createCookie('filepicker_token_json', JSON.stringify(response.companyAccess), 3);
            if (response.user.chargebee_plan_id === 'starter')
              storage.showUpgradeModal = true;
          }
          jQuery('#login').modal('hide');
          jQuery('#is-Error').addClass('hide');
          self._cookieService.createCookie('storage', JSON.stringify(storage), 3);
          if(response.user.role !== 'ADMIN'){
            let status = {
              cardStatus: self.cardStatus,
              subsStatus: response.subscription.currentplan.subscription.status
            };
            self._cookieService.createCookie('status', JSON.stringify(status),3);
          }
          if (response.user.role !== 'ADMIN') {
            self.loggedInSerivce.login();
            self._userService.token = response.token;
            let url = response.company.sub_domain + '.' + environment.APP_EXTENSION + '/dashboard';
            if (!self.subDomainService.subDomain.is_sub_domain_url) {
              jQuery(location).attr('href', environment.PROTOCOL + url);
            } else {
              window.location.href = window.location.origin + '/dashboard';
            }
            /*--- Tracking events goes here ---*/
            ga('markettingteam.send', 'event', 'Login', 'Submit', 'LoginPage');
            // _kmq.push(['identify', value.email]);
            // _kmq.push(['record', 'Logged In']);
            /*---------------------------------*/
          }
          else {
            window.location.href = window.location.origin + '/admin/companies';
          }
        }
      },
      (response: any) => {
        self.resendEmailShow = false;
        jQuery('#loginSubmit').removeClass('loading');
        jQuery('#loginSubmit').html('Login');
        jQuery('#loginSubmit').attr('disabled', false);
        jQuery('#loginSubmit').attr('disabled', false);
        jQuery('#is-Error').removeClass('hide');
        //self.isError = true;
        self.ErrorMsg = response.error.message;
        if (response.error.code === 'E_USER_NOT_FOUND') {
          self.ErrorMsg = "Something isn't quite right. Please enter a correct email and password..";
        }
        else if (response.error.code === 'E_USER_ACCOUNT_DISABLED') {
          self.userId = response.error.err_errors;
          // if (self.userId !== null) {
          //   self.ErrorMessage = 'Your account has been disabled. Please verify your email to continue using Outgrow.';
          //   // self.resendEmailShow = true;
          // }else {
            self.ErrorMsg = 'Your account has been disabled. Please signup again!';
          // }
        }
        else if (response.error.code === 'E_USER_ACCOUNT_LEFT') {
          self.ErrorMsg = response.error.message;
          self.userId = response.error.err_errors;
        }
        console.log("error message",self.ErrorMsg);
        jQuery("#login-error-msg").html(self.ErrorMsg);
      }
      );
  }

  signUp() {
    jQuery('#leads').addClass('hide');
    jQuery('#signUp').removeClass('hide');
    this.router.navigate(['/signup']);
  }

  closeLogin() {
      // Redirecting to main home page //
    this.router.navigate(['/']);
  }

  resendEmail() {
    //console.log('user id', this.userId);
    this._userService.resendEmail(this.userId)
      .subscribe(
      (success: any) => {
        jQuery('#sendMail').addClass('hide');
        window.toastNotification('Email has been sent, Please check your email.');
      },
      (error: any) => {
        //console.log('company Error', error);
      }
      );
  }

  forgetPassword() {
    this.router.navigate(['/forgetPassword']);
  }

  callGA() {
    // _kmq.push(['record', 'Log In Click']);
  }
}
