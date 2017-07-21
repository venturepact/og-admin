import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ElementRef, Renderer,AfterViewInit, ViewEncapsulation } from '@angular/core';
import { EmailValidator } from './../../shared/validators/email.validator';
import { Router } from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {CompanyService} from '../../shared/services/company.service';
import {Script} from '../../shared/services/script.service';
declare var jQuery:any;
declare var window :any;

@Component({
  selector: 'og-forget-passwrd',
  templateUrl: './forgetPassword.component.html',
  styleUrls: ['./forgetPassword.component.css','./../../../assets/css/sahil-hover.css','./../../../assets/css/custom-material.css'],
  encapsulation: ViewEncapsulation.None,
})

export class ForgetPasswordComponent implements OnInit,AfterViewInit {
  forgetPasswordForm:FormGroup;
  error:Boolean = false;
  leads :any;
  companyType:Boolean = false;
  errorMsg  :any ;
  emailError :Boolean  =  false;
  forgetPasswordError :Boolean  =  false;
  mailSent:String;
  resetMsg :String;
  captchaCode :string;
  isCaptcha :Boolean = false;
  resendEmailShow :boolean = false;
  userId: any;
  constructor(
              public fb: FormBuilder,
              public _userService: UserService,
              public _companyService : CompanyService,
              public _render :Renderer,
              public _element :ElementRef,
              public _router:Router,
              public _script : Script
            ) {
                window['verifyCallback'] = this.verifyCallback.bind(this);
              }

  ngOnInit() {

    this.forgetPasswordForm = this.fb.group({
      forgetemail: ['', Validators.compose([
        Validators.required, EmailValidator.format
      ])]
    });
    jQuery.material.init();

  }

  ngAfterViewInit() {
    this._script.load('captcha')
        .then((data:any )=>{
          //console.log('capctha',data);
        })
        .catch((error)=>{
            //console.log('Script not loaded', error);
    });
  }


  errorShow() {
    this.error = true;
  }

  errorHide() {
    this.error = false;
    jQuery('#forgetPasswordError').addClass('hide');
    jQuery('#success-mailSent').addClass('hide');
  }

  errorEmailHide() {
    this.emailError = false;
  }

  checkEmail() {
      this.errorHide();
  }

  checkCompanyEmail() {
      this.errorEmailHide();
  }
  verifyCallback(cap:any){
    this.captchaCode = cap;
    this.isCaptcha = true;
    let email = this.forgetPasswordForm.value.forgetemail;
    if(email!='')
      jQuery('#btnReset').attr('disabled',false);
  }
  forgetPassword() {
    jQuery('#btnReset').addClass('loading');
    jQuery('#btnReset').text('Please Wait');
    jQuery('#btnReset').attr('disabled',true);
    /*this._userService.verifyCaptcha(this.captchaCode)
        .subscribe(
        (response: any) => {*/
            this._userService.forgetPassword(this.captchaCode,this.forgetPasswordForm.value)
                .subscribe(
                (response: any) => {
                if (response.active === false) {
                  this.errorMsg = 'User Account has not been approved yet!';
                  jQuery('#forget-password-error').html(this.errorMsg);
                  jQuery('#forgetPasswordError').removeClass('hide');
                }else {
                  this.mailSent ='We have sent you an email with a link to reset your password.'+
                                'Please check your email, click on the link and set a new password.';
                  jQuery('#success-mailSent').removeClass('hide');
                  setTimeout(
                    function()
                    {
                      window.location.href = window.location.origin;
                    }, 5000);
                }
                  jQuery('#btnReset').text('Reset Password');
                  jQuery('#btnReset').removeClass('loading');
                },
                (error :any ) =>  {
                  let error_code = error.error.code;
                  if(error_code === 'E_USER_INVALID_CAPTCHA' || error_code === 'E_USER_NO_CAPTCHA'){
                      this.errorMsg = error.error.err_message;
                  }else if (error.error.code === 'E_USER_ACCOUNT_DISABLED') {
                  this.errorMsg = 'Your account has been disabled.Please verify your email to continue using Outgrow.';
                   this.userId = error.error.err_errors;
                  this.resendEmailShow = true;
                }else{
                    this.errorMsg = error.error.message;
                  }
                  jQuery('#forget-password-error').html(this.errorMsg);
                  jQuery('#forgetPasswordError').removeClass('hide');
                  jQuery('#btnReset').text('Reset Password');
                  jQuery('#btnReset').removeClass('loading');
                  jQuery('#btnReset').attr('disabled',false);
                }
              );
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
  close() {
    this._router.navigate(['/login']);
  }
}
