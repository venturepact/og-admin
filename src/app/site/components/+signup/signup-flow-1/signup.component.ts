import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, ElementRef, OnInit, Renderer} from '@angular/core';
import {Email, User} from './User';
import {EmailValidator} from '../../../../shared/validators/email.validator';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {environment} from './../../../../../environments/environment';
import {Title} from '@angular/platform-browser';
import {UserService} from '../../../../shared/services/user.service';
import {CompanyService} from '../../../../shared/services/company.service';
import {CookieService} from '../../../../shared/services/cookie.service';

declare var jQuery: any;
declare var ga: any;
// declare var _kmq:any;
declare var window: any;
declare var fbq: any;

@Component({
  selector: 'signup-component',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', './../../../../../assets/css/sahil-hover.css', './../../../../../assets/css/custom-material.css'],
})

export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  error: Boolean = false;
  signUp: Boolean = false;
  model = new User('', new Email('', true), '', '', '', false, '');
  leads: any;
  errorMsg: any;
  emailError: Boolean = false;

  constructor(public fb: FormBuilder,
              public _userService: UserService,
              public _companyService: CompanyService,
              public _render: Renderer,
              public _element: ElementRef,
              public _router: Router,
              public route: ActivatedRoute,
              public titleService: Title,
              public _cookieService: CookieService) {
    this.titleService.setTitle("Outgrow Home");
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      let data = params['aic'];
      console.log('DAta', data);
      if (data) {
        console.log('Inside');
        this._cookieService.createCookie('referralCode', data, 3);
      }
    });
    localStorage.removeItem('leads');
    this.signupForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required, EmailValidator.format
      ])]
    });
    jQuery.material.init();
  }


  errorShow() {
    this.error = true;
  }

  errorHide() {
    this.error = false;
  }

  errorEmailHide() {
    this.emailError = false;
  }

  saveLeads() {
    jQuery('#btnSignUp').addClass('loading');
    jQuery('#btnSignUp').text('Please wait');
    jQuery('#btnSignUp').attr('disabled', true);
    let data = this.signupForm.value.email.toLowerCase();
    localStorage.setItem('leads', data);
    let signupSubscription = this._userService.leads(data)
      .subscribe(
        (response: any) => {
          if (response._id !== null) {
            //jQuery('#leads').addClass('hide');
            /*=== Tracking snippet ===*/
            /*========================*/
            this._router.navigate(['/signup']);
          }
        },
        (error: any) => {
          let error_code = error.error.code;
          if (error_code === 'E_UNEXPECTED' && error.error.err_message === 'Email is already registered with us, please log in!') {
            this.login();
          } else {
            this.errorMsg = (error.error.err_errors !== '' ) ? error.error.err_errors.email.message :
              error.error.err_message;
          }
          this.error = this.errorMsg;
          jQuery('#btnSignUp').removeClass('loading');
          jQuery('#btnSignUp').attr('disabled', false);
          jQuery('#btnSignUp').html('Get Started');
          signupSubscription.unsubscribe();
        }
      );

  }

  checkEmail() {
    this.errorHide();
  }

  checkCompanyEmail() {
    this.errorEmailHide();
  }

  login() {
    this._router.navigate(['/login']);
  }

  reset() {
    this._router.navigate(['/forgetPassword']);
  }

  close() {
    var link = environment.APP_EXTENSION;
    var protocol = environment.PROTOCOL;
    window.location.href = protocol + link;
  }

  callGA() {
    // _kmq.push(['record', 'Sign Up Click']);
  }
}
