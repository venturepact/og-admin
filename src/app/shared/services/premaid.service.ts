import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable'
import { BaseService } from './base.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PremaidService extends BaseService {
    constructor(private _http: Http) {
        super();
    }

    getPremaidList(): Observable<any> {
        return this._http.get(this._url + '/admin/premaid_list')
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveTag(data): Observable<any> {
        return this._http.post(this._url + '/admin/save_tag', data)
            .map(this.extractData)
            .catch(this.handleError);
    }
}
