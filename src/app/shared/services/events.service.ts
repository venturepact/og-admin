import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http } from '@angular/http';
@Injectable()
export class EventsService extends BaseService {

  constructor(private _http: Http) {
    super()
  }
  getEvents(data) {
    return this._http.post(this._url + '/admin/getEvents', data)
      .map(this.extractData)
      .catch(this.handleError)
  }
  createEvent(data) {
    return this._http.post(this._url + '/admin/createEvent', data)
      .map(this.extractData)
      .catch(this.handleError)
  }
  updateEvent(data) {
    return this._http.put(this._url + '/admin/updateEvent', data)
      .map(this.extractData)
      .catch(this.handleError)
  }
  removeEvent(event_id) {
    return this._http.delete(this._url + '/admin/removeEvent/' + event_id)
      .map(this.extractData)
      .catch(this.handleError)
  }
}
