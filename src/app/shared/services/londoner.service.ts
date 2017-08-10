import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BaseService } from './base.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LondonerService extends BaseService {

  constructor(private _http: Http) {
    super();
  }

  getSoundCloud(): Observable<any> {
    return this._http.get(this._url + '/builder/get_londoner_app')
      .map(this.extractData)
      .catch(this.handleError)
  }
}
