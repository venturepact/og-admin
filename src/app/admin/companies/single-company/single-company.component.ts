import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {AfterViewInit, Component, Output, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AdminCompany} from '../../../shared/models/company';
import {AdminService} from '../../../shared/services/admin.service';
import {CompanyService, CookieService} from "../../../shared/services";

declare var jQuery: any;

@Component({
  selector: 'og-single-company',
  templateUrl: './single-company.component.html',
  styleUrls: ['./single-company.component.css'],
})

export class SingleCompanyComponent implements OnInit, AfterViewInit {
  templates: any = [];
  company_users: any[];
  id: any;
  currentTab: any;
  @Output() company: any;
  custom_features: any;
  companyFeatures: any;
  childCompanies: any;
  sub_role: string;
  constructor(public companyService: CompanyService,
              public route: ActivatedRoute,
              public _adminService: AdminService,
              public _cookieService: CookieService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getCompanyInfo(this.id);
    });

  }

  ngOnInit() {
    if (this._cookieService.readCookie('storage')) {
      let storage = JSON.parse(this._cookieService.readCookie('storage'));
      this.sub_role = storage.user.sub_role;
    }
  }

  ngAfterViewInit() {

    //  this.getCompanyInfo(this.id);
    this.getCompanyUser(this.id);

  }

  getCompanyFeatures(company) {
    let $ref = this.companyService.getCompanyFeatures(company)
      .subscribe((data) => {
        this.companyFeatures = data;
        this.companyFeatures['company'] = this.company.id;
        this.companyFeatures.features && (this.templates = this.getFeatures(this.companyFeatures.features, 'templates'));
        $ref.unsubscribe();
      }, error => {
        $ref.unsubscribe();
      })
  }

  showTab(tab: any) {
    this.currentTab = tab;
    if (tab === 'company') {
      jQuery('.company').removeClass('hide');
      jQuery('.membership').addClass('hide');
      jQuery('.team').addClass('hide');
      jQuery('.features').addClass('hide');
      jQuery('.integrations').addClass('hide');
      jQuery('.logs').addClass('hide');
      jQuery('.usage-cycle').addClass('hide');
    }
    else if (tab === 'membership') {
      jQuery('.company').addClass('hide');
      jQuery('.membership').removeClass('hide');
      jQuery('.team').addClass('hide');
      jQuery('.features').addClass('hide');
      jQuery('.integrations').addClass('hide');
      jQuery('.logs').addClass('hide');
      jQuery('.usage-cycle').addClass('hide');
    }
    else if (tab === 'team') {
      jQuery('.team').removeClass('hide');
      jQuery('.company').addClass('hide');
      jQuery('.membership').addClass('hide');
      jQuery('.features').addClass('hide');
      jQuery('.integrations').addClass('hide');
      jQuery('.logs').addClass('hide');
      jQuery('.usage-cycle').addClass('hide');
    }
    else if (tab === 'features') {
      jQuery('.team').addClass('hide');
      jQuery('.features').removeClass('hide');
      jQuery('.company').addClass('hide');
      jQuery('.membership').addClass('hide');
      jQuery('.integrations').addClass('hide');
      jQuery('.usage-cycle').addClass('hide');
      jQuery('.logs').addClass('hide');
    }
    else if (tab === 'integration') {
      jQuery('.team').addClass('hide');
      jQuery('.integrations').removeClass('hide');
      jQuery('.company').addClass('hide');
      jQuery('.membership').addClass('hide');
      jQuery('.features').addClass('hide');
      jQuery('.usage-cycle').addClass('hide');
      jQuery('.logs').addClass('hide');
    }
    else if (tab === 'logs') {
      jQuery('.team').addClass('hide');
      jQuery('.integrations').addClass('hide');
      jQuery('.company').addClass('hide');
      jQuery('.membership').addClass('hide');
      jQuery('.features').addClass('hide');
      jQuery('.usage-cycle').addClass('hide');
      jQuery('.logs').removeClass('hide');
    }
    else if (tab === 'usage-cycle') {
      jQuery('.team').addClass('hide');
      jQuery('.integrations').addClass('hide');
      jQuery('.company').addClass('hide');
      jQuery('.membership').addClass('hide');
      jQuery('.features').addClass('hide');
      jQuery('.logs').addClass('hide');
      jQuery('.usage-cycle').removeClass('hide');
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
    Observable.forkJoin([
      this.companyService.getCompanyInfo(this.id),
      this.companyService.getCustomFeatures(this.id),
      this._adminService.getChildCompanies(this.id)])
      .subscribe((data: any) => {
        this.company = new AdminCompany(data[0].company);
        this.company['reset_period_list'] = data[0].reset_period_list;
        this.custom_features = data[1];
        this.getCompanyFeatures(this.company);
        this.childCompanies = data[2];
      }, error => {
        console.log("error");
      });
  }

  updatecompany(data) {
    this.company = data;
  }

  getFeatures(features, parentFeature) {
    let item = features.find(feature => {
      return feature['_id'] === parentFeature;
    });
    return (item ? item['sub_features'] : []);
  }

  emitChanges(changes) {
    changes = changes.filter(obj => obj['parent_feature'] === 'templates');
    changes.length && this.companyService.companyTemplates.next(changes);
  }
}
