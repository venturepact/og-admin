import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../../../../shared/services/base.service';

@Injectable()
export class CalculatorAnalytics extends BaseService {

  constructor(public _http: Http) {
    super();
  }

  getTrafficStats(data: any) {
    let URL = this._url + '/analytic/calculator_stats';
    return this._http.post(URL, data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
  exportToSheet(data: any) {
    let URL = this._url + '/analytic/export_to_sheet';
    return this._http.post(URL, data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
  exportToSheetAsync(data: any) {
    let URL = this._url + '/analytic/export_to_sheet_async';
    return this._http.post(URL, data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
  //getleads
  getAvgOfLeads(data: any): Observable<any> {
    return this._http.post(
      this._url + '/analytic/get_leads_avg',
      data,
      this.post_options()
    )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getStats(key: any): Observable<any> {
    return this._http.post(
      this._url + '/analytic/get_stats',
      key,
      this.post_options()
    )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getLeadsCount(companyId: any): Observable<any> {
    return this._http.get(
      this._url + '/analytic/leads/count/' + companyId
    )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getFunnels(calcId: string): Observable<any> {
    return this._http.post(
      this._url + '/funnel/get_funnels',
      { calc: calcId },
      this.post_options()
    )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getQuestionStatsData(funnelId: string): Observable<any> {
    return this._http.post(
      this._url + '/funnel/get_questions_data',
      { funnel: funnelId },
      this.post_options()
    )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getStatsData(funnelId: string): Observable<any> {
    return this._http.post(
      this._url + '/funnel/get_stats_data',
      { funnel: funnelId },
      this.post_options()
    )
      .map(this.extractData)
      .catch(this.handleError);
  }

}
