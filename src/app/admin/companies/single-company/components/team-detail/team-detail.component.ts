import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AdminService} from '../../../../../shared/services/admin.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PlanService} from "../../../../../shared/services/plan.service";
import {EmailValidator} from "../../../../../shared/validators/email.validator";
import {UserService} from "../../../../../shared/services/user.service";
declare var jQuery;
declare var window: any;

@Component({
  selector: 'team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css', './../../../../../../assets/css/sahil-hover.css', './../../../../../../assets/css/custom-material.css']
})

export class TeamDetailComponent implements OnInit {

  @Input() team: any[];
  @Input() company: any;
  @Input() userLimit: number;
  @Input() companyId: string;
  delUser: any = '';
  error: any = '';
  formAddMember: FormGroup;

  constructor(private _router: Router, private _adminService: AdminService,
              private _planService: PlanService, private userService: UserService) {
    console.log(this.team);
  }

  ngOnInit(): void {
    this.createForm();
    if (this.userLimit === -1) {
    }
    else if (!this.userLimit) {
      this.getPlanLimits();
    }
  }

  getPlanLimits() {
    let self = this;
    let getPlanLimits = self._planService.getPlanLimits(self.companyId)
      .subscribe(
        (success: any) => {
          self.userLimit = success.users;
          getPlanLimits.unsubscribe();
        },
        (error: any) => {
          getPlanLimits.unsubscribe();
        }
      );
  }

  navigateUser(id: String) {
    this._router.navigate(['/admin/user/' + id]);
  }

  deleteUser(user: any) {
    this.error = '';
    if (this.team.length > 1) {
      let adminCount = 0;
      this.team.forEach((member: any) => {
        if (member.user_company.role === 'ADMIN')
          adminCount++;
      });
      if (user.user_company.role === 'ADMIN' && adminCount > 1) {
        this.delUser = user;
        jQuery('#modalDelUserConfirm').modal('show');
      } else if (user.user_company.role !== 'ADMIN') {
        this.delUser = user;
        jQuery('#modalDelUserConfirm').modal('show');
      } else {
        window.toastNotification('can\'t delete only admin member of company');
      }
    } else {
      window.toastNotification('can\'t delete only member of company');
    }
  }

  deleteConfirmed() {
    let self = this;
    jQuery('#confirmYes').html('Please wait...').attr('disabled', true);
    jQuery('#confirmNo').attr('disabled', true);
    let delConfirmed = self._adminService.deleteUser(self.delUser).subscribe(
      (success: any) => {
        self.error = '';
        jQuery('#confirmYes').html('Yes').attr('disabled', false);
        jQuery('#confirmNo').attr('disabled', false);
        jQuery('#modalDelUserConfirm').modal('hide');
        self.removeMember();
        window.toastNotification('User deleted Successfully');
        delConfirmed.unsubscribe();
      },
      (error: any) => {
        self.error = error.error.err_message;
        jQuery('#confirmYes').html('Yes').attr('disabled', false);
        jQuery('#confirmNo').attr('disabled', false);
        delConfirmed.unsubscribe();
      }
    );
  }

  removeMember() {
    let i = this.team.length;
    while (i--) {
      if (this.team[i] && this.team[i].hasOwnProperty('_id') && this.team[i]['_id'] === this.delUser._id) {
        this.team.splice(i, 1);
        break;
      }
    }
  }

  addNewMember() {
    jQuery('#btnAddMember').html('please wait...').attr('disabled', true);
    let self = this;
    let addNewMember = self._adminService.addNewMember(self.formAddMember.value, self.companyId).subscribe(
      (success: any) => {
        self.error = '';
        let user = success.user;
        user['user_company'] = success.userCompany;
        self.team.push(user);
        jQuery('#btnAddMember').html('Add').attr('disabled', false);
        jQuery('#modalAddUser').modal('hide');
        self.createForm();
        window.toastNotification('User added Successfully');
        addNewMember.unsubscribe();
      },
      (error: any) => {
        self.error = error.error.err_message ? error.error.err_message : error.error.message;
        jQuery('#btnAddMember').html('Add').attr('disabled', false);
        addNewMember.unsubscribe();
      }
    );
  }

  createForm() {
    this.formAddMember = new FormGroup({
      memberName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      memberEmail: new FormControl('', [Validators.required, EmailValidator.format]),
      memberRole: new FormControl('MANAGER')
    });
  }

  approve(userid) {
    this.userService.userApproval(this.company.sub_domain, userid, true).subscribe((data) => {
      console.log(data, "xo");

      for (let i = 0; i < this.team.length; i++) {
        if (this.team[i]._id == userid) {
          this.team[i].user_company.status = data.status;
          this.team[i].user_company.active = true;

        }
      }
      window.toastNotification("User approved");
    })

  }
}
