import { Injectable } from '@angular/core';
import {CookieService} from './cookie.service';
import {environment} from '../../../environments/environment';

declare var window: any;
declare var jQuery: any;
declare var LeadDyno: any;
declare var webengage: any;
declare var Appcues: any;

@Injectable()
export class MarketingService {

  intercom_id: string = environment.INTERCOM_ID;

  constructor(public _cookieService: CookieService){

  }

  initMarketingStuff() {
    //Intercom
    if (this._cookieService.readCookie('storage')) {
		let storage = JSON.parse(this._cookieService.readCookie('storage'));

		let hiddenLauncher = false;

		// if (storage.company.is_appsumo_created) {
		// 	hiddenLauncher = true;
		// }

		window.Intercom('boot', {
			app_id: this.intercom_id,
			email: storage.user.emails[0].email,
			name: storage.user.name,
			'ISLEAD': false,
			created_at: (Math.round(Date.parse(storage.user.createdAt) / 1000)),
			hide_default_launcher: hiddenLauncher,
			custom_launcher_selector: '.intercom_trigger',
			widget: {
				activator: '#IntercomDefaultWidget'
			}
		});
    } else {
		window.Intercom('boot', {
			app_id: this.intercom_id,
			widget: {
			  activator: '#IntercomDefaultWidget'
			}
		});
    }
    //webengage
    //webengage.init('~15ba1d98c');
    if (window.location.href.indexOf('/preview') >= 0) {
      window.Intercom('update', { hide_default_launcher: true });
    }
  }

}
