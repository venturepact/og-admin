import {Component, OnInit, Input} from '@angular/core';
import {AdminService} from '../../../shared/services/admin.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

declare var jQuery: any;
declare var window :any;

@Component({
  selector: 'og-autologin-token',
  templateUrl: './autologinToken.component.html'
})
export class AutologinTokenComponent implements OnInit {
  token :any ='';
  autoLoginTokenForm: FormGroup;
  dealToken :any=[];
  isTokenExist:Boolean = false;

  constructor(public _adminService: AdminService) {
  }

  ngOnInit() {
    this. getAutoLoginToken();
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
    const deleteGoal = self._adminService.removeAutoLoginToken({token}).subscribe(
      (success: any) => {
        jQuery("#"+token.token).remove();
        deleteGoal.unsubscribe();
      },
      (error: any) => {
        console.log('error', error);
        deleteGoal.unsubscribe();
      }
    );
  }

}
