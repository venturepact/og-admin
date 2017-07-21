import {  Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { User, Email} from  './User';
import { EmailValidator } from '../../../../shared/validators/email.validator';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {MarketingService} from '../../../../shared/services/marketing.service';
import {Script} from '../../../../shared/services/script.service';
import { Title } from '@angular/platform-browser';
import {CompanyService} from '../../../../shared/services/company.service';
import {UserService} from '../../../../shared/services/user.service';
import {CookieService} from '../../../../shared/services/cookie.service';
import {SubDomainService} from '../../../../shared/services/subdomain.service';
declare var jQuery:any;
declare var ga:any;
declare var window:any;
declare var qp:any;
declare var fbq: any;

@Component({
  selector: 'signup-detail-component',
  templateUrl: './signupDetail.component.html',
  styleUrls: ['./signupDetail.component.css','./../../../../../assets/css/sahil-hover.css','./../../../../../assets/css/custom-material.css'],
})

export class SignupDetailComponent implements OnInit {
  referralCode : String;
  browser_ip : String;
  user_agent : String;
  signupFormdetail :FormGroup;
  callSchedule : FormGroup;
  signUp :Boolean = false;
  model = new User('',new Email('',true),'','','',false,'','');
  traffic : any;
  leads :any;
  companyType:Boolean = false;
  isAppSumo:Boolean = false;
  isAppsumoBlack:Boolean = false;
  isAffillates:Boolean = false;
  isDealfuel:Boolean = false;
  errorMsg  :any ;
  temp_name :String ='template';
  isSubmit :Boolean = false;
  domainExtension: any = '';
  constructor(
              public fb: FormBuilder,
              public _userService: UserService,
              public _companyService : CompanyService,
              public _render :Renderer,
              public _element :ElementRef,
              public _router:Router,
              public _cookieService:CookieService,
              public _marketingService:MarketingService,
              public _script:Script,
              public titleService: Title,
              public route: ActivatedRoute,
              public _subDomainService : SubDomainService,
            ) {
                this.route.queryParams.subscribe((params:Params) => {
                  let data = params['email'];
                  if(data && this.validateEmail(data)) {
                    this.populateForm(data);
                    this.saveLeads(data);
                  }
                });
                if(this._router.url.split('/')[1] === 'appsumo') this.isAppSumo = true;
                if(this._router.url.split('/')[1] === 'appsumo_black') this.isAppsumoBlack = true;
                if(this._router.url.split('/')[1] === 'dealfuel') this.isDealfuel = true;
                if(this._router.url.split('/')[1] === 'affiliates') this.isAffillates = true;
                //REFERRAL CANDY CODE FOR PURCHASE
                this.referralCode = _cookieService.readCookie('referralCode');
                this.titleService.setTitle("Outgrow Home");
                let data = localStorage.getItem('leads');
                if(data!==null) {
                  this.populateForm(data);
                }

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
    this.domainExtension = '.' + environment.APP_EXTENSION;
    //this.isExtension = false;
    let formGroup = {
      name  : [this.model.name, Validators.compose([Validators.required, Validators.minLength(3)])],
      email       : [this.model.emails.email, Validators.compose([Validators.required, EmailValidator.format])],
      password    : [this.model.password, Validators.compose([Validators.required, Validators.minLength(8)])],
      companyname : [this.model.companyname,Validators.compose([Validators.required,Validators.minLength(4),Validators.pattern('^[a-zA-Z0-9,. \\-\\s]+$')])],
      domain      : [this.model.domain,Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z0-9]*$')
      ])],
      // referralCode : [this.referralCode],
      // browser_ip : [this.browser_ip],
      // user_Agent : [this.user_agent]
    }
    if(this.isAppSumo || this.isDealfuel || this.isAppsumoBlack) {
      formGroup['promoCode'] = [this.model.promoCode,Validators.compose([
          Validators.minLength(3),
        ])
      ]
    }

    this.signupFormdetail  = this.fb.group(formGroup);
    this.callSchedule = this.fb.group({
      traffic :[this.traffic, Validators.compose([Validators.maxLength(10),Validators.pattern('^[0-9]*$') ])],
      leads   :[this.leads, Validators.compose([Validators.maxLength(10),Validators.pattern('^[0-9]*$') ])],
      companyType: this.companyType
    });
    jQuery.material.init();

  }

  populateForm(data:any){
    this.model.name         = data.split('@')[0];
    this.model.emails.email = data;
    this.model.companyname  = data.split('@')[1].split('.')[0];
    this.model.domain       = data.split('@')[1].split('.')[0];
    let sub_domain = this._cookieService.readCookie("claim_sub_domain");
    if(sub_domain){
      this.model.domain = sub_domain;
    }
      this._script.load("marketing").then(function() {
          if(window.location.href.indexOf('outgrow.co') >= 0) {
              fbq('track', 'Lead', { value: data });
          }
      });
  }

  validateEmail(email:any) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  saveLeads(data:any) {

    localStorage.setItem('leads',data);
    /*=== Tracking snippet ===*/
    // if(window.location.href.indexOf('outgrow.co') >= 0) { fbq('track', 'Lead'); }
    /*========================*/
    let signupSubscription = this._userService.leads(data)
      .subscribe(
        (response :any )=> {
          if(response._id !== null ) {

            /*=== Tracking snippet ===*/
            window.Intercom('update', { 'email': data, 'ISLEAD': true });
            /*========================*/

            //jQuery('#leads').addClass('hide');
            // this._router.navigate(['/signup']);
          }
        },
        (error :any ) => {
          //console.log("ERROR",error);
          let error_code = error.error.code;
          if(error_code ==='E_UNEXPECTED' && error.error.err_message ==='Email is already registered with us, please log in!') {
            this.login();
            // this.errorMsg = ' Email is already registered with us! Try';
            //this.resetMsg = 'instead or';
            //this.isLeadExist = true;
          } else {
            this.errorMsg = (error.error.err_errors !=='' ) ? error.error.err_errors.email.message :
              error.error.err_message ;
          }
          jQuery("#signup-error-msg").html(this.errorMsg);
          signupSubscription.unsubscribe();
        }
      );

  }

  errorEmailHide() {
    //this.emailError = false;
    jQuery('#emailError').addClass('hide');
  }


  userSignUp(user :any =null) {
    this.isSubmit = true;
    this.errorMsg='';
    if(this.isAppSumo && this.model.promoCode){
      let doregex = new RegExp('^(dealfuel)[0-9]*(outgrow)$');
      let odregex = new RegExp('^(outgrow)[0-9]*(dealfuel)$');
      if(doregex.test(this.model.promoCode.toLowerCase()) || odregex.test(this.model.promoCode.toLowerCase())) {
        this.errorMsg = 'Invalid coupon code';
        jQuery('#emailError').removeClass('hide');
        //this.emailError = this.errorMsg;
        return false;
      }
    }else if(this.isDealfuel  && this.model.promoCode){
      let aoregex = new RegExp('^(appsumo)[0-9]*(outgrow)$');
      let oaregex = new RegExp('^(outgrow)[0-9]*(appsumo)$');
      if(aoregex.test(this.model.promoCode.toLowerCase()) || oaregex.test(this.model.promoCode.toLowerCase())) {
        this.errorMsg = 'Invalid coupon code';
        jQuery('#emailError').removeClass('hide');
        //this.emailError = this.errorMsg;
        return false;
      }
    }else if(this.isAppsumoBlack  && this.model.promoCode){
      let abregex = new RegExp('^(appsumo)[0-9]*(black)$');
      if(!abregex.test(this.model.promoCode.toLowerCase())) {
        this.errorMsg = 'Invalid coupon code';
        jQuery('#emailError').removeClass('hide');
        //this.emailError = this.errorMsg;
        return false;
      }
    }
    if(this.signupFormdetail.valid) {
      this.isSubmit = false;
      jQuery('#btnSaveDetail').addClass('loading');
      jQuery('#btnSaveDetail').text('Please wait');
      jQuery('#btnSaveDetail').attr('disabled',true);
      user = this.model;
      user['referralCode'] = this.referralCode;
      if(this.isAffillates) {
        user['affillates'] = this.isAffillates;
      }
      let signupSubscription = this._userService.register(user)
          .subscribe(
            (response: any) => {
              this._subDomainService.setCurrentCompany(response.company);
              let storage = {
                  'token'       : response.token,
                  'user'        : response.user,
                  'currentCompany': response.company.sub_domain,
                  'temp_name'   : this.temp_name,
                  'companyList' : response.companyList
              };
              this._cookieService.createCookie('filepicker_token_json', JSON.stringify(response.companyAccess), 3);
              this._cookieService.createCookie('storage',JSON.stringify(storage),3);
              localStorage.setItem('domain',this.model.domain);
              localStorage.removeItem('leads');
              if(response.user.role !== 'ADMIN'){
                let status = {
                  cardStatus: response.subscription.result.customer.card_status,
                  subsStatus: response.subscription.result.subscription.status
                  };
                  this._cookieService.createCookie('status',JSON.stringify(status),3);
              }

              /*=== Tracking snippet ===*/
              window.Intercom('update', { 'email': this.model.emails.email, 'ISLEAD': false });
              /*========================*/

              /*----- Analytics Tracking code here -------*/
              ga('markettingteam.send', 'event', 'Signup', 'Submit', 'SignUpPage');
              // _kmq.push(['identify', user.emails.email]);
              // _kmq.push(['record', 'Signed Up']);
              if(window.location.href.indexOf('outgrow.co') >= 0) {
                if (this.isAppSumo)
                  fbq('trackCustom', 'AppsumoRegistration');
                if (this.isAppsumoBlack)
                  fbq('trackCustom', 'AppsumoBlackRegistration');
                if (this.isDealfuel)
                  fbq('trackCustom', 'DealfuelRegistration');
                fbq('track', 'CompleteRegistration');
                if ('undefined' !== typeof(qp)) qp('track', 'Generic')
              }
              /*------------------------------------------*/

              //this._router.navigate(['/templates']);
              this.redirectToDomain();
            },
            (error :any ) =>  {
              let error_code = error.error.code;
              if(error_code === 'E_UNIQUE_USERNAME_VALIDATION' ||
                error_code==='E_UNIQUE_EMAIL_VALIDATION' ||
                error_code==='E_UNIQUE_UNIDENTIFIED_VALIDATION'
              ) {
                this.errorMsg = ' Email is already registered with us! Please Log in';
              }else if(error.error.err_errors['sub_domain']) {
                 this.errorMsg = error. error.err_errors['sub_domain'].message;
              }else if(error_code === 'E_UNEXPECTED' && error.error.err_message === 'id : The size should not be more than 50') {
                 this.errorMsg = 'The size should not be more than 50 characters';
              }else  {
                this.errorMsg = error. error.err_errors['emails.0.email']?
                                error. error.err_errors['emails.0.email'].message : error.error.err_message;
              }
              let start = this.errorMsg.indexOf(':');
              let end = this.errorMsg.length;
              if (start != -1 && end != 0) {
                start++;
                this.errorMsg = this.errorMsg.substring(start, end);
              }
              jQuery('#emailError').removeClass('hide');
              //this.emailError = this.errorMsg;
              jQuery('#btnSaveDetail').removeClass('loading');
              jQuery('#btnSaveDetail').text('SignUp');
              jQuery('#btnSaveDetail').attr('disabled',false);
              signupSubscription.unsubscribe();
            }
      );
    }
  }

  saveSchedule() {
    jQuery('#btnLeads').text('Please wait..');
    let signupSubscription = this._companyService.saveCallSchedule(this.callSchedule.value)
        .subscribe(
          (response: any) => {
            this.redirectToDomain();
          },
          (error :any ) =>  {
            jQuery('#btnLeads').text('Save');
            signupSubscription.unsubscribe();
          }
    );
  }



  skip() {
     var link = environment.APP_EXTENSION;
     var url = this.model.domain+'.'+link;
     var protocol = environment.PROTOCOL;
     jQuery(location).attr('href',protocol + url);
  }

  redirectToDomain() {
    localStorage.removeItem('leads');
    let link = environment.APP_EXTENSION;
    let protocol = environment.PROTOCOL;
    let url = this.model.domain+'.'+link+'/dashboard';
    jQuery(location).attr('href',protocol + url);
  }

  checkCompanyEmail() {
      this.errorEmailHide();
  }

  closeModal() {
    if(this._cookieService.readCookie('storage') !==null ) {
        this.redirectToDomain();
    } else {
      jQuery('#signUp').modal('hide');
    }
  }

  showPassword() {
    if (jQuery('#password').attr('type')==='password') {
      jQuery('#btnShowPassword').addClass('hide');
      jQuery('#btnHidePassword').removeClass('hide');
      jQuery('#password').attr('type','text');
    }
  }

  hidePassword() {
    if (jQuery('#password').attr('type')==='text') {
      jQuery('#btnHidePassword').addClass('hide');
      jQuery('#btnShowPassword').removeClass('hide');
      jQuery('#password').attr('type','password');
    }
  }

  login() {
   this._router.navigate(['/login']);
  }
  close() {
     this._router.navigate(['/']);
  }
}