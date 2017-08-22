import {OnInit, Component, Input} from '@angular/core';
import {AdminService} from './../../../../../shared/services/admin.service';
import {ActivatedRoute} from '@angular/router';
import {AdminCompany} from '../../../../../shared/models/company';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {MembershipService} from "../../../../../shared/services/membership.service";

declare var jQuery: any;
declare var moment: any;
declare var window: any;

@Component({
  selector: 'membership-detail',
  templateUrl: './membership-details.component.html',
  styleUrls: ['./membership-details.component.css'],
})

export class MembershipDetailComponent implements OnInit {
  id: string;
  @Input() company: any;
  payment: any;
  plan: any;
  subscriptionStatus: string = '';
  trial_end: string;
  trial_start: string;
  start_date: string;
  end_date: string;
  status: boolean;
  card: any;
  edit_mode: boolean = false;
  isInvoiceExist: boolean = false;
  invoices: any = [];
  invoiceNo: any;
  addon_leads: Number;
  addon_traffic: Number;
  plan_leads: Number;
  plan_traffic: Number;
  plan_leads_check: boolean = false;
  plan_traffic_check: boolean = false;
  reset_current_usage: boolean = false;
  reset_period: Number;
  //allow_reset : string = "Yes";

  err_message: String = '';
  updateFormDetail: FormGroup;

  constructor(public _membershipService: MembershipService,
              public _adminService: AdminService,
              public route: ActivatedRoute,
              public fb: FormBuilder) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.initLeadTrafficData();
    this.getPlanSubscription();
    this.getInvoices();

    this.updateFormDetail = this.fb.group({
      plan_leads: [this.plan_leads, Validators.compose([Validators.required, Validators.pattern('^-1$|^[0-9]{1,7}$')])],
      plan_traffic: [this.plan_traffic, Validators.compose([Validators.required, Validators.pattern('^-1$|^[0-9]{1,7}$')])],
      addon_leads: [this.addon_leads, Validators.compose([Validators.required, Validators.pattern('^-1$|^[0-9]{1,7}$')])],
      addon_traffic: [this.addon_traffic, Validators.compose([Validators.required, Validators.pattern('^-1$|^[0-9]{1,7}$')])],
      reset_period: [this.reset_period, Validators.compose([Validators.required, Validators.pattern('^-1$|^[0-9]{1,7}$')])],
      plan_leads_check: [],
      plan_traffic_check: []
      //reset_current_usage:[]
    });

    // setInterval(function(){
    // }.bind(this),1000);
  }

  initLeadTrafficData() {
    // console.log('company>>>>>>>>>>>>>>>initLeadTrafficData',this.company);
    this.addon_leads = this.company.addon_leads;
    this.addon_traffic = this.company.addon_traffic;
    this.plan_leads = this.company.leads.total;
    this.plan_traffic = this.company.traffic.frequency;
    this.plan_leads_check = this.plan_leads === -1 ? true : false;
    this.plan_traffic_check = this.plan_traffic === -1 ? true : false;
    this.reset_current_usage = this.company.reset_current_usage ? true : false;
    this.reset_period = this.company.reset_period;

    //this.allow_reset = this.reset_current_usage === true ? "Yes" : "No";

  }


  getPaymentDetails() {
    this._membershipService.getPaymentDetails(this.id)
      .subscribe((result: any) => {
        this.payment = result;
      });
  }

  getPlanSubscription() {
    this._membershipService.getplanSubscription(this.id)
      .subscribe((result: any) => {
        // console.log('result',result);
        this.plan = result.currentplan.subscription.plan_id;
        this.subscriptionStatus = result.currentplan.subscription.status;
        this.trial_end = moment.unix(result.currentplan.subscription.trial_end).format('DD-MM-YYYY');
        this.trial_start = moment.unix(result.currentplan.subscription.trial_start).format('DD-MM-YYYY');
        this.start_date = moment.unix(result.currentplan.subscription.started_at).format('DD-MM-YYYY');
        this.card = result.currentplan.card;
      });
  }

  changed() {
    this.reset_current_usage = jQuery('#resetChange').prop('checked');
    this.updateCompanyAddon();
  }

  updateCompanyAddon() {
    jQuery('#btnSaveDetail').text('Please wait...').attr('disabled', true);
    let data = {
      addon: {
        leads: this.addon_leads,
        traffic: this.addon_traffic
      },
      plan: {
        leads: this.plan_leads_check ? -1 : this.plan_leads,
        traffic: this.plan_traffic_check ? -1 : this.plan_traffic
      },
      reset_period: this.reset_period,
      reset_current_usage: this.reset_current_usage
    };
    //this.allow_reset = this.reset_current_usage ? "Yes" : "No";
    if (this.updateFormDetail.status === 'VALID') {
      this._adminService.updateCompanyAddon(data, this.id)
        .subscribe((result) => {
          this.edit_mode = false;
          jQuery('#btnSaveDetail').text('Update').attr('disabled', false);
          this.company.leads = result.leads;
          this.company.traffic = result.traffic;
          this.company.current_limit_leads = result.current_limit.leads;
          this.company.current_limit_traffic = result.current_limit.traffic;
          this.company.addon_leads = result.addon.leads;
          this.company.addon_traffic = result.addon.traffic;
          this.company.addon_quantity = result.addon.quantity;
          this.company.current_usage_leads = result.current_usage.leads;
          this.company.current_usage_traffic = result.current_usage.traffic;
          this.company.reset_period = result.reset_period;
        }, (error) => {
          console.log(error, 'error in addon updation');
          jQuery('#btnSaveDetail').text('Update').attr('disabled', false);
        });
    }

  }

  addAddon() {
    let data = {};
    jQuery('#addAddonbtn').html('please wait ....').attr('disabled', true);
    this._membershipService.updateAddon(data, this.company.id)
      .subscribe((response) => {
        // console.log(response, 'this is the addon updated');
        window.toastNotification('Addon Added Successfully');
        this.company = new AdminCompany(response);
        this.initLeadTrafficData();
        jQuery('#addAddonbtn').html('Add Addon').attr('disabled', false);
      }, (error) => {
        console.log(error);
        jQuery('#addAddonbtn').html('Add Addon').attr('disabled', false);
        this.err_message = error.error.err_message;
      });
  }

  checkPlan(event: any, type: string) {
    if (event.target.checked) {
      if (type === 'leads') {
        this.plan_leads = -1;
      } else {
        this.plan_traffic = -1;
      }
    } else {
      if (type === 'leads') {
        this.plan_leads = 0;
      } else {
        this.plan_traffic = 0;
      }
    }
  }

  getInvoices() {
    let self = this;
    this._membershipService.getInvoices(this.id)
      .subscribe(
        (invoices: any) => {
          invoices.list.forEach((invoiceList: any) => {
            self.invoiceNo++;
            invoiceList.invoice.invoiceNo = self.invoiceNo;
            self.isInvoiceExist = true;
            // console.log(invoiceList.invoice.id, 'invoice');
            this._membershipService.getInvoicesPdf(invoiceList.invoice.id, this.id)
              .subscribe(
                (data: any) => {
                  // console.log('Get Pdf', data);
                  invoiceList.invoice.href = data.download.download_url;
                  invoiceList.invoice.date = moment.unix(invoiceList.invoice.date).format('DD-MM-YYYY');
                },
                (error: any) => {
                  console.log('Issue in pdf', error);
                }
              );
            self.invoices.push(invoiceList.invoice);
          });
        },
        (error: any) => {
          console.log('get invoice getErrro', error);
        }
      );
  }
}
