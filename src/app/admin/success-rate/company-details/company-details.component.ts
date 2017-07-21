import {Component, Input, OnInit} from "@angular/core";
import {AdminService} from "../../../shared/services/admin.service";
import {CalculatorAnalytics} from "../../../site/components/+analytics/services/calculator-analytics.service";

declare var moment: any;
declare var jQuery: any;
declare var bootbox: any;

@Component({
  selector: 'og-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./../success-rate.component.css']
})
export class CompanyDetailsComponent implements OnInit {

  @Input()
  company: any;
  companyAppDetails: Array<any> = [];
  userDetails: Array<any> = [];
  loadingAppDetails: boolean = false;
  loadingUserDetails: boolean = false;
  loadingIntercom: boolean = false;
  disableCompany: boolean;

  constructor(public adminService: AdminService, public _calculatorAnalytics: CalculatorAnalytics) {
  }

  ngOnInit() {
    this.loadingAppDetails = true;
    this.loadingUserDetails = true;
    this.loadingIntercom = true;

    this.adminService.getCompanyAppDetails(this.getParams()).subscribe((data) => {
      this.companyAppDetails = data.apps;

      for (let i = 0; i < this.companyAppDetails.length; i++) {
        this.companyAppDetails[i].createdAt = moment(this.companyAppDetails[i].createdAt).fromNow().trim();
        this.companyAppDetails[i].updatedAt = moment(this.companyAppDetails[i].updatedAt).fromNow().trim();
      }
      this.loadingAppDetails = false;
    }, err => this.loadingAppDetails = false);

    this.adminService.getCompanyUserDetails(this.getParams()).subscribe((data) => {
      this.loadingUserDetails = false;
      this.userDetails = data;

      for (let i = 0; i < this.userDetails.length; i++) {
        this.userDetails[i].created_at = moment(this.userDetails[i].created_at).fromNow().trim();
        this.userDetails[i].last_login = moment(this.userDetails[i].last_login).fromNow().trim();
        this.userDetails[i].username = this.userDetails[i].username.split('.')[0];
      }

      let emails = [];
      for (let i = 0; i < this.userDetails.length; i++) {
        emails.push(this.userDetails[i].emails[0].email);
      }

      this.adminService.getUserDetailsFromIntercom({emails: emails})
        .subscribe((data) => {

          for (let i = 0; i < this.userDetails.length; i++) {
            this.userDetails[i].session_count = data[i].session_count;
          }
          this.loadingIntercom = false;
        }, (err) => {
          this.loadingIntercom = false;

          for (let i = 0; i < this.userDetails.length; i++) {
            this.userDetails[i].session_count = 'Not Found';
          }
        });
    }, err => this.loadingUserDetails = false);
  }

  getParams() {
    return {
      company: this.company._id
    }
  }

  exportCompanyDetails() {
    jQuery('.export-company-details').html('Preparing...');
    this.adminService.exportDataToSheet(this.getParams()).subscribe(sheetUrl => {
      this.exportAsSpreadSheet(sheetUrl);
      this.disableCompany = false;
      jQuery('.export-company-details').html('View Sheet');
    }, err => {
      this.disableCompany = false;
      jQuery('.export-company-details').html('View Sheet');
    });
  }

  exportAppDetails(app: any, target) {
    let offset = new Date().getTimezoneOffset();
    app.disable = true;
    target.innerHTML = 'Preparing';
    this._calculatorAnalytics.exportToSheet({
      id: app._id, lead: app.analytics.leadsCount,
      offset: offset
    }).subscribe(
      (response: any) => {
        this.exportAsSpreadSheet(response);
        app.disable = false;
        target.innerHTML = 'View Sheet';
      },
      (error) => {
        app.disable = false;
        target.innerHTML = 'View Sheet';
      }
    );
  }

  exportAsSpreadSheet(url) {
    let w = window.open(url, '_blank');
    if (!w) {
      bootbox.dialog({
        closeButton: false,
        message: `<button type="button" class="bootbox-close-button close" data-dismiss="modal"
                               aria-hidden="true" style="margin-top: -10px;">×</button>
                            <div class="bootbox-body-left">
                                  <div class="mat-icon">
                                    <i class="material-icons">error</i>
                                  </div>
                              </div>
                              <div class="bootbox-body-right">
                                <p>Your browser is blocking this action.</p>
                                <p>Please enable pop-ups for the spreadsheet to open.</p>
                              </div>
                  `,
        buttons: {
          success: {
            label: "OK",
            className: "btn btn-ok btn-hover",
            callback: function () {
            }
          }
        }
      });
    }
  }
}
