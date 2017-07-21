import { Injectable } from '@angular/core';
import { Http  } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { BaseService } from './base.service';
@Injectable()
export class WebhookService extends BaseService {
  constructor(public _http: Http) {
    super();
  }

  testWebhook(data:any): Observable<any> {
    data['event'] = 'LEADS';
    // let data = {
    //   url:Url,
    //   event: 'LEADS'
    // }
    return this._http.post(this._url + '/calc/webhook/test', data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
  saveWebhook(data): Observable<any> {
    return this._http.post(this._url + '/calc/webhook/save', data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllWebhook(company):Observable<any>{
    return this._http.get(this._url + '/comp/webhook/'+company, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getCalcWebhook(calcId):Observable<any>{
    return this._http.get(this._url + '/calc/webhook/'+calcId, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  activateWebhook(calcId, status):Observable<any>{
    return this._http.put(this._url + '/calc/webhook/'+calcId, {status:status},this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
}
