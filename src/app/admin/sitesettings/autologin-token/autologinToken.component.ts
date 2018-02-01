import {Component, OnInit, Input} from '@angular/core';
import {AdminService} from '../../../shared/services/admin.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Script} from '../../../shared/services/script.service';
import { environment } from '../../../../environments/environment';

declare var jQuery: any;
declare var window :any;
declare var Clipboard: any;

@Component({
  selector: 'og-autologin-token',
  templateUrl: './autologinToken.component.html'
})
export class AutologinTokenComponent implements OnInit {
  token :any ='';
  autoLoginTokenForm: FormGroup;
  dealToken :any=[];
  isTokenExist:Boolean = false;

  constructor(public _adminService: AdminService, public _script : Script) {
  }

  ngOnInit() {
    this. getAutoLoginToken();
  }

  ngAfterViewInit() {
    this._script.load('ClipBoard')
      .then((data) => {
        console.log('Clipboard loaded');
      })
      .catch((error) => {
        console.log('script load error', error);
      });

  }

  genearteToken(){
    this.token ='';
    let variables = "abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ0123456789";
    let tokenLength = 24;
    for (var i= 0; i<tokenLength; i++) {
      let tokens = Math.floor(Math.random() * variables.length);
      this.token += variables.substring(tokens,tokens+1);
    }
  }

  openModal(){
    jQuery('#dealname').val('');
    jQuery('#dealtoken').val('');;
    jQuery('#autoLoginModal').modal('show');;
  }

  saveToken(){
    let dealname= jQuery('#dealname').val();
    let data ={
     dealname : dealname,
     token : this.token
    }
    if (this.token && dealname!='') {
      jQuery('.btnAdd').attr('disabled', true).html('Please wait...');
      const self = this;
      const saveToken = self._adminService.saveAutoLoginToken(data).subscribe(
        (success: any) => {
          window.toastNotification('Added Successfully');
          jQuery('#dealname').val('');
          this.token = '';
          jQuery('.btnAdd').attr('disabled', false).html('Save');
          this. getAutoLoginToken();
          jQuery('#autoLoginModal').modal('hide');
        },
        (error: any) => {
          console.log('error', error);
          jQuery('.btnAdd').attr('disabled', false).html('Add');
          saveToken.unsubscribe();
        }
      );
    }else{
      window.toastNotification('Both fields are mandatory');
    }
  }

  private getAutoLoginToken() {
    this.dealToken=[];
    const self = this;
    self._adminService.getSiteSettings()
      .subscribe(
        (data: any) => {
          let tokenLength = data.autoLogin.token.length;
          if(tokenLength>0){
            this.isTokenExist = true;
            for(let i=0; i< tokenLength ;i++){
              let insertObj = {};
              insertObj['dealname'] = data.autoLogin.token[i].dealname;
              insertObj['token'] =  data.autoLogin.token[i].token;
              this.dealToken.push(insertObj);
            }
          }else{
            this.isTokenExist = false;
          }
        }, (error: any) => {
          console.log('errors', error);
        }
      );
  }

  deleteToken(token:any) {
    const self = this;
    const delToken = self._adminService.removeAutoLoginToken({token}).subscribe(
      (success: any) => {
        this.getAutoLoginToken();
        window.toastNotification('Record deleted successfully');
        delToken.unsubscribe();
      },
      (error: any) => {
        console.log('error', error);
        delToken.unsubscribe();
      }
    );
  }

  editToken(token:any){
    jQuery('#autoLoginModal').modal('show');
    jQuery('#dealname').val(token.dealname);
    jQuery('.deal-name').addClass('is-focused');
    jQuery('#dealtoken').val(token.token);
  }

  copyToken(token:any){
    new Clipboard('#copy-token', {
      text: function(trigger) {
        let link = environment.APP_DOMAIN +'/login?verifyToken='+token.token+'&email=your_email_address'
        return link ;
      }
    });
    window.toastNotification('Token copied');
  }

}
