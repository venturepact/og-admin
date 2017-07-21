import { Injectable } from '@angular/core';
import { Http  } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { BaseService } from './base.service';
import { SubDomainService } from './subdomain.service';


@Injectable()
export class ReferralService extends BaseService {

  constructor(
    public _http: Http,
    public _subDomianService: SubDomainService
  ) {
    super();
  }

  getCoupon(){
    let company_id = this._subDomianService.subDomain.company_id;

    let url = this._url + '/referralCode/'+company_id;
    return this._http.get(url,this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
