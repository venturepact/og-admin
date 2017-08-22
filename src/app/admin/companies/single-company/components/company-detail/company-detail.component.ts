import {Component, OnInit, Input, EventEmitter} from '@angular/core';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AdminCompany} from '../../../../../shared/models/company';
import {CompanyService} from './../../../../../shared/services/company.service';
import {MembershipService} from './../../../../../shared/services/membership.service';
import {AdminService} from './../../../../../shared/services/admin.service';

declare var jQuery: any;

@Component({
  selector: 'company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
  outputs: ['childCompany']
})

export class CompanyDetailComponent implements OnInit {

  @Input() company: any = '';
  childCompany = new EventEmitter<any>();
  updateCompany: any = ''; //AdminCompany = new AdminCompany({});
  leads: any = '';
  traffic: any = '';
  id: any;
  edit_mode: Boolean = false;
  loading: boolean = false;
  updateFormdetail: FormGroup;
  isSubmit: Boolean = false;
  errorMsg: any;
  planList: any;

  constructor(public companyService: CompanyService, public fb: FormBuilder,
              public route: ActivatedRoute, public _adminService: AdminService,
              public _membershipService: MembershipService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }


  ngOnInit() {
    this.errorMsg = '';
    this.updateCompany = this.company;
    this.updateFormdetail = this.fb.group({
      companyname: [this.updateCompany.name, Validators.compose([Validators.required, Validators.minLength(4)])],
      domain: [this.updateCompany.sub_domain, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z0-9]*$')
      ])],
      cname: [this.updateCompany.cname.url],
      root_url: [this.updateCompany.cname.url],
      error_url: [this.updateCompany.cname.url],
      current_referral_program: [this.updateCompany.current_referral_program],
      agency: [this.updateCompany.agency],
      c_cust_id: [this.updateCompany.chargebee_customer_id],
      c_sub_id: [this.updateCompany.chargebee_subscription_id],
      c_plan_id: [this.updateCompany.chargebee_plan_id],
      s_cust_id: [this.updateCompany.stripe_customer_id],
      is_admin_created: [this.updateCompany.is_admin_created],
      leads_limit: [this.leads],
      traffic_limit: [this.traffic],
      integration: [this.updateCompany.integration],
      calculators: [this.updateCompany.current_limit_calculators],
      users: [this.updateCompany.current_limit_users],
      companies: [this.updateCompany.current_limit_companies],
      isAppSumo: [this.updateCompany.isAppSumo],
      leaddyno_url: [this.updateCompany.referral.leaddyno_url],
      is_referralcandy_visible: [this.updateCompany.referral.is_referralcandy_visible],
      referralcandy_url: [this.updateCompany.referral.referralcandy_url],
      sharing_url: [this.updateCompany.referral.sharing_url]
    });
    this.getPlanList();
  }

  getPlanList() {
    this._membershipService.getPlanList()
      .subscribe((result) => {
        this.planList = result.list;
      });
  }

  getCompanyInfo(id: number) {
    this.companyService.getCompanyInfo(id)
      .subscribe(
        (response: any) => {
          this.company = new AdminCompany(response.company);
          this.updateCompany = new AdminCompany(response.company);
          this.leads = this.updateCompany.leads.total;
          this.traffic = this.updateCompany.traffic.frequency;
        },
        (response: any) => {
        }
      );
  }

  updateCompanyInfo() {
    this.errorMsg = '';
    jQuery('#btnSaveDetail').text('Please wait...').attr('disabled', true);
    this.isSubmit = true;
    if (this.updateFormdetail.valid) {
      this.loading = true;
      this.isSubmit = false;
      this._adminService.updateCompany(this.updateCompany, this.id)
        .subscribe(
          (response: any) => {
            this.company = new AdminCompany(response);
            this.loading = false;
            this.edit_mode = false;
            this.childCompany.emit(this.company);
            this.errorMsg = '';
            jQuery('#btnSaveDetail').text('Update').attr('disabled', false);
          },
          (error: any) => {
            this.loading = false;
            this.edit_mode = true;
            this.getCompanyInfo(this.updateCompany.id);
            this.errorMsg = error.error.err_message;
            jQuery('#btnSaveDetail').text('Update').attr('disabled', false);
          }
        );
    }
  }


}
