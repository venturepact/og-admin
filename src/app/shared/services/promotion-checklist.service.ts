import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BaseService } from './base.service';

@Injectable()
export class PromotionChecklistService extends BaseService {

    constructor(
        public _http: Http
    ) {
        super();
    }

    getPromotionGoals () {
        return this._http.get(this._url + '/promotion/goals', this.get_options())
            .map(this.extractData)
            .catch(this.handleError)
    }

    getPromotionList(calcid: String) {
        return this._http.get(this._url + '/calcstrategies/' + calcid, this.get_options())
            .map(this.extractData)
            .catch(this.handleError)
    }

    updateCalcStrategies(data: any, calcid: String) {
      return this._http.put(this._url + '/calcstrategies/' + calcid, data, this.putOptions())
            .map(this.extractData)
            .catch(this.handleError)
    }
}
