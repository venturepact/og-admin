import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from './base.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from "rxjs/Observable";

@Injectable()
export class LondonerService extends BaseService {

  constructor(private _http: Http) {
    super();
  }

  getSoundCloud(data): Observable<any> {
    return this._http.get(this._url + '/builder/get_londoner_app/' + data.limit + '/' + data.skip)
      .map(this.extractData)
      .catch(this.handleError)
  }

  getPreviousData(data): Observable<any> {
    return this._http.get(this._url + '/builder/get_previous_records/' + data.limit )
      .map(this.extractData)
      .catch(this.handleError)
  }

  updateTime(data): Observable<any> {
    return this._http.put(this._url + '/builder/email_time_update/' + data.id + '/' + data.timeVal, {})
      .map(this.extractData)
      .catch(this.handleError)
  }
}
