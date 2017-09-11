import {AfterViewInit, Component, NgZone, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CompanyService} from './../../../shared/services/company.service';
import {AdminCompany} from '../../../shared/models/company';
import {PlatformLocation} from "@angular/common";

declare var jQuery: any;

@Component({
  selector: 'og-single-company',
  templateUrl: './single-company.component.html',
  styleUrls: ['./single-company.component.css'],
})

export class SingleCompanyComponent implements AfterViewInit {

  company_users: any[];
  id: number;
  currentTab: any;
  @Output() company: any;

  constructor(public companyService: CompanyService,
              public route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id);
      //this.router.navigate(['/admin/company/', this.id]);
      this.getCompanyInfo(this.id);
      this.getCompanyInfo(this.id);
    });

  }

  ngAfterViewInit() {
    this.getCompanyUser(this.id);
    this.getCompanyInfo(this.id);
  }

  showTab(tab: any) {
    this.currentTab = tab;
    if (tab === 'company') {
      jQuery('.company').removeClass('hide');
      jQuery('.membership').addClass('hide');
      jQuery('.team').addClass('hide');
      jQuery('.features').addClass('hide');
      jQuery('.integrations').addClass('hide');
    }
    else if (tab === 'membership') {
      jQuery('.company').addClass('hide');
      jQuery('.membership').removeClass('hide');
      jQuery('.team').addClass('hide');
      jQuery('.features').addClass('hide');
      jQuery('.integrations').addClass('hide');
    }
    else if (tab === 'team') {
      jQuery('.team').removeClass('hide');
      jQuery('.company').addClass('hide');
      jQuery('.membership').addClass('hide');
      jQuery('.features').addClass('hide');
      jQuery('.integrations').addClass('hide');
    }
    else if (tab === 'features') {
      jQuery('.team').addClass('hide');
      jQuery('.features').removeClass('hide');
      jQuery('.company').addClass('hide');
      jQuery('.membership').addClass('hide');
      jQuery('.integrations').addClass('hide');
    }
    else if (tab === 'integration') {
      jQuery('.team').addClass('hide');
      jQuery('.integrations').removeClass('hide');
      jQuery('.company').addClass('hide');
      jQuery('.membership').addClass('hide');
      jQuery('.features').addClass('hide');
    }
  }

  getCompanyUser(id: number) {
    this.companyService.getCompanyUsers(id)
      .subscribe(
        (response: any) => {
          this.company_users = response;
        });
  }

  getCompanyInfo(id: number) {
    this.companyService.getCompanyInfo(id)
      .subscribe(
        (response: any) => {
          this.company = new AdminCompany(response.company);
          this.company['reset_period_list'] = response.reset_period_list;
        },
        (response: any) => {
        }
      );
  }

}
