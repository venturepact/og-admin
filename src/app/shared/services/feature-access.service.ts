import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {FeatureAccess} from '../interfaces/features.interface';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import {SubDomainService} from './subdomain.service';
import {CompanyService} from './company.service';
import {BaseService} from './base.service';

@Injectable()

export class FeatureAuthService extends BaseService {
  selectedFeature: string = 'none';
  subfeature: string = null;

  features: FeatureAccess = new FeatureAccess(null);

  constructor(private _http: Http,
              private _subDomainService: SubDomainService,
              private _companyService: CompanyService) {
    super();
  }

  getfeatureAccess(featureName: string): Observable<boolean> | boolean {
    let companyAccess = JSON.parse(this.readCookie('filepicker_token_json'));
    let subscription_status = '';
    companyAccess.forEach((e: any) => {
      if (e.key === this._subDomainService.subDomain.sub_domain) {
        subscription_status = e.value;
      }
    });
    if (subscription_status === 'active' || subscription_status === 'in_trial') {
      let company = this._subDomainService.currentCompany.id;
      let getUrl = this._url + '/planfeature/check/' + company + '/' + featureName;
      return this._http.get(getUrl, this.options)
        .map(this.boolData)
        .catch(this.handleError);
    }
  }

  checkCalcLimit(): Observable<boolean> {
    let company = this._subDomainService.subDomain.company_id;
    let getUrl = this._url + '/plan/check/calc/' + company;
    return this._http.get(getUrl, this.options)
      .map(this.boolData)
      .catch(this.handleError);
  }

  getAppSumofeatures(isAppSumo: boolean) {
    if (isAppSumo) {
      this.features.integrations.active = true;
      //this.features.integrations.active_campaign = true;
      //this.features.integrations.get_response = true;
      // this.features.integrations.mailchimp = true;
    }
  }

  getAllFeatureAccess() {
    let companyAccess = JSON.parse(this.readCookie('filepicker_token_json'));
    let sub_domain = this._subDomainService.subDomain.sub_domain;
    // let subscription_status = '';
    // console.log('SUB DOMAIN',sub_domain,'CURRENT COMPANY',this._subDomainService.currentCompany);
    if (!companyAccess)
      window.location.href = window.location.origin + '/logout';
    let company = this._subDomainService.currentCompany;
    company.integration = company.integration ? company.integration : false;
    let getUrl = this._url + '/company/features/access/' + sub_domain;
    return this._http.post(getUrl, {}, this.post_options())
      .map(this.extractData)
      .catch(this.handleError)
  }

  getPublicFeatureAccess() {
    let sub_domain = this._subDomainService.subDomain.sub_domain;
    let getUrl = this._url + '/company/features/access/' + sub_domain;
    return this._http.post(getUrl, {}, this.post_options())
      .map(this.extractData)
      .catch(this.handleError)
  }


// getting all features for company
  getCompanyFeatures(company: string) {
    let getUrl = this._url + '/company/features/' + company;
    return this._http.get(getUrl, this.options)
      .map(this.boolData)
      .catch(this.handleError);
  }

  // updating company features
  updateCompanyFeatures(feature: any, company: any) {
    let data = {};
    data['features'] = feature;
    let putUrl = this._url + '/company/features/update/' + company;
    return this._http.put(putUrl, data, this.putOptions())
      .map(this.boolData)
      .catch(this.handleError);
  }

  setSelectedFeature(feature: string, sub_feature: string = null) {
    this.selectedFeature = feature;
    this.subfeature = sub_feature;
  }

}
