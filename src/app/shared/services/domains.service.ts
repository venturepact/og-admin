import { Injectable } from '@angular/core';
import { Http  } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { BaseService } from './base.service';
import { Domains }  from './../models/domains';

@Injectable()
export class DomainService extends BaseService {
    token: string;
    response:any;
    constructor(public _http: Http) {
        super();
    }

    getDomains(data : any): Observable<Domains> {
        let getDomainsUrl = this._url + '/reserved/domains';
        return this._http.post(getDomainsUrl,data,this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    addDomain(domain:string,type:string): Observable<Domains> {
        let getDomainsUrl = this._url + '/reserved/domains/create';
        let data = {
            sub_domain:domain,
            access:type
        };
        return this._http.post(getDomainsUrl,data, this.post_options())
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    deleteDomain(domainId:string): Observable<Domains> {
        let getDomainsUrl = this._url + '/reserved/domain/delete/'+domainId;
        return this._http.delete(getDomainsUrl,this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }
}
