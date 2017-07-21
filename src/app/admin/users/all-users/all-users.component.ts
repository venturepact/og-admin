import { Component, Renderer, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { EmailValidator } from './../../../shared/validators/email.validator';
import {environment} from '../../../../environments/environment';
import { Datatable } from '../../../shared/interfaces/datatable.interface';
import {UserService} from '../../../shared/services/user.service';
import {Script} from '../../../shared/services/script.service';
declare var jQuery: any;
@Component({
  selector: 'og-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css', './../../ionicons.min.css', './../../ionicons.min.css','./../../../../assets/css/sahil-hover.css', './../../../../assets/css/custom-material.css'],
})

export class AllUsersComponent extends Datatable implements AfterViewInit {
  data: Object = [];
  extension: string = environment.APP_EXTENSION;
  addUserForm: FormGroup;
  error: boolean = false;
  errorMessage: string = '';
  loading: boolean = false;
  constructor(
    public userService: UserService,
    public renderer: Renderer,
    public router: Router,
    public _script: Script,
    public fb: FormBuilder
  ) {
    super();
    this.addUserForm = this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      useremail: ['', Validators.compose([Validators.required, EmailValidator.format])],
      userPassword: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      companyName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      companySubDomain: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9]*$')])],
      chargebeeId: [''],
      chargebeeSubsId: [''],
      plan: ['']
    });
  }

  ngAfterViewInit() {
    this._script.load('datatables')
      .then((data) => {
        this.getAllUsers();
      })
      .catch((error) => {
        console.log('Script not loaded', error);
      });

    jQuery('.modal').on('hidden.bs.modal', function () {
      this.error = false;
      this.errorMessage = '';
    });
  }


  getAllUsers() {
    this.loading = true;
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
      searchKey: this.search
    };
    this.userService.getAllUsers(obj)
      .subscribe(
      (response: any) => {
        this.data = response.users;
        this.total_pages = Math.ceil(response.count / this.current_limit);
        this.loading = false;
      },
      (response: any) => {
        this.loading = false;
        console.log('all users error', response);
      }
      );
    jQuery(document).on('click', '.editUser', function () {
      let user_id = jQuery(this).data('user-id');
      window.location.href = window.location.origin + '/admin/user/' + user_id;
    });
  }
  addUser() {
    let self = this;
    jQuery('#adminAddUser').text('Please wait..').attr('disabled', true);
    let addUser = this.userService.addUserFromAdmin(this.addUserForm.value)
      .subscribe(
      (success: any) => {
        // console.log('adus', success.user._id);
        jQuery('#adminAddUser').text('Add').attr('disabled', false);
        self.error = false;
        self.errorMessage = '';
        jQuery('#add-user').modal('hide');
        let url = environment.APP_DOMAIN + '/admin/user/' + success.user._id;
        jQuery(location).attr('href', url);
      },
      (error: any) => {
        self.error = true;
        self.errorMessage = error.error.err_message;
        jQuery('#adminAddUser').text('Add').attr('disabled', false);
        addUser.unsubscribe();
      }
      );
  }

  navigateUser(id: string) {
    this.router.navigate(['/admin/user/' + id]);
  }

  dateFormat(date: any) {
    let d = new Date(date);
    return d.toString().split('GMT')[0];
  }

  paging(num: number) {
    super.paging(num);
    this.getAllUsers();
  }

  limitChange(event: any) {
    super.limitChange(event);
    this.getAllUsers();
  }

  previous() {
    super.previous();
    this.getAllUsers();
  }

  next() {
    super.next();
    this.getAllUsers();
  }

  searchData() {
    super.searchData();
    this.getAllUsers();
  }


}
