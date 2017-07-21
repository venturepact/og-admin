import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable()
export class CookieService {
    createCookie(name:string,value:string,days:number) {
        value = ( name == 'storage' && value != '' ? this.spliceCookie(JSON.parse(value)) : value );
        let expires = "";
        let domain  = environment.APP_EXTENSION;
        if (days) {
            let date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toUTCString();
        }
        document.cookie = name+"="+value+expires+"; domain="+domain+"; path=/";
    }

    spliceCookie(storage){
        storage.user ? storage.user.location = '' : '';
        storage.company ? storage.company.name = '' : '';
        //console.log(storage.user.location,"in method CCCCC",storage.user.location);

        return JSON.stringify(storage);
    }

    readCookie(name:string) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i=0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    eraseCookie(name:string) {
        this.createCookie(name,"",-1);
    }
}
