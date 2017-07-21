import {OnInit, Component, Input, AfterViewInit} from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {AdminService} from './../../../../../shared/services/admin.service';
import { User } from '../../../../../shared/models/user';
import { EmailValidator } from './../../../../../shared/validators/email.validator';
import {UserService} from '../../../../../shared/services/user.service';
import {Script} from '../../../../../shared/services/script.service';
import {CookieService} from "../../../../../shared/services/cookie.service";

declare var jQuery: any;
declare var moment: any;
declare var google: any;
@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {

  @Input() companies: any[];
  model: User = new User({});
  updateModel: User = new User({});
  updateFormdetail: FormGroup;
  emailForm: FormGroup;
  pwdForm: FormGroup;
  edit_mode: boolean = false;
  timezones: any = [];
  loading: boolean = false;
  autocomplete: any;
  isPlaceExist: boolean;
  errorMsg = '';
  isSubmit: boolean = false;
  emailUpdate: String = '';
  pwdUpdate: String = '';
  message: String = '';
  pwd_message: String = '';
  email_verify: Boolean = false;
  set_pwd_link: String;
  public id: number;
  sub_role: string = '';
  constructor(
    public _userService: UserService,
    public _adminService: AdminService,
    public route: ActivatedRoute,
    public _script: Script,
    public router: Router,
    public fb: FormBuilder,
    public _cookieService: CookieService
  ) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {

    this.getUserDetails();
    this.getPwdLink();
    this.updateFormdetail = this.fb.group({
        name: [this.updateModel.name, Validators.compose([Validators.required, Validators.minLength(4)])],
        username: [this.updateModel.username, Validators.compose([])],
        active: [this.updateModel.active, Validators.compose([Validators.required])],
        timezone: [this.updateModel.timezone, Validators.compose([])],
        sub_role: [this.updateModel.sub_role]
    });

    this.emailForm = this.fb.group({
      email: [this.emailUpdate, Validators.compose([
        Validators.required, Validators.minLength(4), EmailValidator.format
      ])]
    });

     this.pwdForm = this.fb.group({
      pwd: [this.pwdUpdate, Validators.compose([
        Validators.required, Validators.minLength(8),
      ])]
    });
    if (this._cookieService.readCookie('storage')) {
      let storage = JSON.parse(this._cookieService.readCookie('storage'));
      this.sub_role = storage.user.sub_role;
    }
  }

  ngAfterViewInit() {
    this._script.load('timeZoneMin', 'googleLocation')
      .then((data: any) => {
        this.initialize();
        this.timezones = moment.tz.names();
        for (let timezone in this.timezones) {
          this.timezones[timezone] = this.timezones[timezone] + ' ' + moment.tz(this.timezones[timezone]).format('Z z');
        }
      })
      .catch((error) => {
        //console.log('Script not loaded', error);
      });
  }

  editMode() {
    if (this.edit_mode) {
      this.initialize();
    }
  }

  initialize() {
    localStorage.removeItem('pid');
    let locationElement: any = document.getElementById('location');
    this.autocomplete = new google.maps.places.Autocomplete(
      (locationElement),
      { types: ['(cities)'] }
    );
    var self = this;
    google.maps.event.addListener(self.autocomplete, 'place_changed', function () {
      let place = this.getPlace();
      if (place.place_id) {
        self.isPlaceExist = true;
        self.updateModel.location = place.formatted_address;
        locationElement.value = place.formatted_address;
        localStorage.setItem('pid', <string>self.model.location);
        jQuery('#saveBasicDetails').attr('disabled', false);
      }
    });
  }

  getUserDetails() {
    this._userService.getUser(this.id)
      .subscribe((result) => {
        this.model = new User(result);
        this.updateModel = new User(result);
        console.log("result",this.model);
        this.emailUpdate = result.emails[0].email;
        this.email_verify = result.emails[0].verification.complete;
        this.loading = false;
        this.edit_mode = false;
      });

  }

  verifyEmail(){
    this.loading = true;
    this._adminService.verifyEmail(<string>this.model.id)
          .subscribe((result)=> {
              this.model = new User(result);
              this.updateModel = new User(result);
              // console.log(result, "user model");
              this.emailUpdate = result.emails[0].email;
              this.email_verify = result.emails[0].verification.complete;
              this.loading = false;
              this.edit_mode = false;
          },
          (error)=>{
              console.log("error in verification of email", error);
          });
  }



  chkLocation() {
    let pid = localStorage.getItem('pid');
    let locationElement: any = document.getElementById('location');
    let self = this;
    if (self.isPlaceExist === false && pid === null) {
      locationElement.value = '';
      localStorage.removeItem('pid');
      jQuery('#saveBasicDetails').attr('disabled', true);
    } else {
      jQuery('#saveBasicDetails').attr('disabled', false);
      locationElement.value = pid;
      self.model.location = locationElement.value;
    }
  }

  companyNavigate(id: string) {
    // console.log(id);
    this.router.navigate(['/admin/company/' + id]);
  }

  updateUser() {
    console.log(this.updateFormdetail.value, this.updateModel);
    if (this.updateFormdetail.valid) {
      this.loading = true;
      this._adminService.updateBasicDetails(this.updateModel, true).subscribe((result) => {
        this.model = new User(result);
        this.loading = false;
        this.edit_mode = false;
      }, (error) => {
        console.log("update user error", error);
        this.loading = false;
      });
    }
  }

  updateEmail() {
    if(this.emailForm.valid){
      jQuery('#updateEmail').html('Please Wait...');
      jQuery('#updateEmail').attr('disabled', true);
      // console.log(this.model.emails[0].email,'this is email');
      if (this.model.emails[0].email !== this.emailUpdate) {
        this.loading = true;
        this._adminService.updateEmail(this.model.emails[0].email, this.emailUpdate, <string>this.model.id)
          .subscribe(
          (data: any) => {
            this.loading = false;
            this.edit_mode = false;
            this.model = data;
            this.updateModel = data;
            jQuery('#updateEmail').html('Change Email');
            jQuery('#updateEmail').attr('disabled', false);
            jQuery('#change-email').modal('hide');
          },
          (response: any) => {
            this.edit_mode = true;
            this.loading = false;
            let error_code = response.error.code;
            if (error_code === 'E_UNIQUE_USERNAME_VALIDATION' ||
              error_code === 'E_UNIQUE_EMAIL_VALIDATION' ||
              error_code === 'E_UNIQUE_UNIDENTIFIED_VALIDATION'
            ) {
              this.message = ' Email is already registered with us!';
            } else {
              this.message = (response.error.err_errors['emails.0.email']) ?
                response.error.err_errors['emails.0.email'].message :
                response.error.err_message;
            }
            jQuery('#updateEmail').html('Change Email');
            jQuery('#updateEmail').attr('disabled', false);
          }
          );
      } else {
        jQuery('#updateEmail').html('Change Email');
        jQuery('#updateEmail').attr('disabled', false);
        this.message = "Com'on atleast change something.";
      }
    }

  }


  updatePwd(){
    if (this.pwdForm.valid) {
      jQuery('#updatePwd').addClass('loading');
      jQuery('#updatePwd').text('Please Wait');
      jQuery('#updatePwd').attr('disabled',true);
      this.loading = true;
      this._adminService.updatePassword(this.pwdUpdate,<string>this.model.id)
          .subscribe(
            (response: any) => {
              this.loading = false;
              this.edit_mode = false;
              if(response.active===false) {
                this.pwd_message = 'User Account has been not approved yet!';
              }else {
                this.pwd_message ='Reset password successfull';
                jQuery('#change-pwd').modal('hide');
                jQuery('#updatePwd').text('Reset Password');
                jQuery('#updatePwd').removeClass('loading');
                jQuery('#updatePwd').attr('disabled',false);
            }},
            (error :any ) =>  {
              this.loading = false;
              this.edit_mode = true;
              this.pwd_message = error.error.err_message;
              jQuery('#updatePwd').text('Reset Password');
              jQuery('#updatePwd').removeClass('loading');
              jQuery('#updatePwd').attr('disabled',false);
            }
      );
    }
  }


  getPwdLink() {
    this._adminService.setPasswordLink(this.id)
       .subscribe((result: any) => {
         this.set_pwd_link = result;
        //  console.log(result);
       });
  }

   generatePwdLink(){
    this._adminService.generatePasswordLink(this.id)
       .subscribe((result:any) => {
         this.set_pwd_link = result;
       });
  }
}
