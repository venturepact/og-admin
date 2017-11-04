import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BaseService } from './base.service';


@Injectable()
export class PremadeCalcService extends BaseService {

    constructor(public _http: Http) {
        super();
    }
    addPremadeCalc(data){
      return this._http.post(this._url+'/admin/addCalculators',data,this.post_options())
              .map(this.extractData)
              .catch(this.handleError);
    }
    getCalculators(data){
        return this._http.post(this._url+'/admin/getCalculators',data,this.post_options())
               .map(this.extractData)
               .catch(this.handleError);
    }

}
