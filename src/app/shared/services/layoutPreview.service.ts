import { Http } from '@angular/http';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LayoutService extends BaseService {
    constructor(private _http: Http) { super() }

    getTemplateLayoutData() {
        return this._http.get(`${this._url}/admin/getTemplates`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    savePreviewUrl(data, id) {
        return this._http.post(`${this._url}/admin/${id}/save_url`, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

}