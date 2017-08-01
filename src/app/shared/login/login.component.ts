import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {EmailValidator} from './../validators/email.validator';
import {Email, User} from './user';
import {Script} from '../services/script.service';
import {Title} from '@angular/platform-browser';
import {MembershipService} from '../services/membership.service';
import {CookieService} from '../services/cookie.service';
import {CompanyService} from '../services/company.service';
import {LoggedInService} from '../services/logged-in.service';
import {UserService} from '../services/user.service';

declare var jQuery: any;

@Component({
  selector: 'og-login',
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./login.component.css', './../../../assets/css/sahil-hover.css', './../../../assets/css/custom-material.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: Boolean = false;
  co: any;
  ErrorMsg: String;
  isError: boolean;
  userId: any;
  isDomainExist: Boolean = false;
  resendEmailShow: Boolean = false;
  model = new User(new Email('', true), '');

  isAdminCreated: boolean = false;
  cardStatus: string = '';

  constructor(public fb: FormBuilder,
              public _userService: UserService,
              public router: Router,
              public loggedInSerivce: LoggedInService,
              public _cookieService: CookieService,
              public _script: Script,
              public titleService: Title,
              public route: ActivatedRoute) {
    this.route.queryParams.subscribe((params: Params) => {
      if (this.validateEmail(params['email'])) {
        this.model.emails.email = params['email'];
      }
    });
    this.titleService.setTitle("Outgrow Home");
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
        Validators.required, Validators.minLength(8)
      ])]
    });
    jQuery.material.init();
  }

  validateEmail(email: any) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  hideErrorMessage() {
    jQuery('#is-Error').addClass('hide');
    //this.isError = false;
  }

  onSubmit(value?: any) {
    value = this.loginForm.value;
    jQuery('#loginSubmit').addClass('loading');
    jQuery('#loginSubmit').html('Please wait');
    jQuery('#loginSubmit').attr('disabled', true);

    this._userService.login(value.email, value.password, null)
      .subscribe((response: any) => {
          if (response.token) {
            let storage: any;
            if (response.user.role === 'ADMIN') {
              storage = {
                'token': response.token,
                'user': response.user
              };
              this._cookieService.createCookie('storage', JSON.stringify(storage), 3);
            } else {
              console.log('asd');
              this.ErrorMsg = 'Please Enter Correct admin credentials';
              jQuery('#is-Error').removeClass('hide');
              jQuery('#is-Error').addClass('show');
            }
            jQuery('#loginSubmit').removeClass('loading');
            jQuery('#loginSubmit').html('Login');
            jQuery('#loginSubmit').attr('disabled', false);
            jQuery('#loginSubmit').attr('disabled', false);
            if (response.user.role === 'ADMIN') {
              window.location.href = window.location.origin + '/admin/companies';
            }
          }
        },
        (response: any) => {
          this.resendEmailShow = false;
          jQuery('#loginSubmit').removeClass('loading');
          jQuery('#loginSubmit').html('Login');
          jQuery('#loginSubmit').attr('disabled', false);
          jQuery('#loginSubmit').attr('disabled', false);
          jQuery('#is-Error').removeClass('hide');
          //self.isError = true;
          this.ErrorMsg = response.error.message;
          if (response.error.code === 'E_USER_NOT_FOUND') {
            this.ErrorMsg = "Something isn't quite right. Please enter a correct email and password..";
          }
          else if (response.error.code === 'E_USER_ACCOUNT_DISABLED') {
            this.userId = response.error.err_errors;
            this.ErrorMsg = 'Your account has been disabled. Please signup again!';
          }
          else if (response.error.code === 'E_USER_ACCOUNT_LEFT') {
            this.ErrorMsg = response.error.message;
            this.userId = response.error.err_errors;
          }
          console.log("error message", this.ErrorMsg);
          jQuery("#login-error-msg").html(this.ErrorMsg);
        }
      );
  }


  closeLogin() {
    // Redirecting to main home page //
    this.router.navigate(['/']);
  }

  callGA() {
  }
}
