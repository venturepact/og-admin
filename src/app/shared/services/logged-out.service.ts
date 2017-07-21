import { Injectable } from '@angular/core';

@Injectable()

export class LoggedOutService {
    public is_sub_domain_url :Boolean =false;
    checkSubDomain(url: String) {
        // trim spaces
        url = url.replace(/^\s+/, '');
        url = url.replace(/\s+$/, '');

        // convert back slash to forward slash
        url = url.replace(/\\/g,'/');

        // remove 'http://', 'https://' or 'ftp://'
        url = url.replace(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i, '');

        // remove 'www.' if exist
        url = url.replace(/^www\./i, '');

        if(url.split('.').length === 3 && url.split('.')[0] === 'app')
            return false;

        // remove path after domain
        url = url.replace(/\/(.*)/, '');

        // remove tld's
        if (url.match(/\.[a-z]{2,3}\.[a-z]{2}$/i)) {
        url = url.replace(/\.[a-z]{2,3}\.[a-z]{2}$/i, '');
        } else if (url.match(/\.[a-z]{2,5}$/i)) {
        url = url.replace(/\.[a-z]{2,5}$/i, '');
        }

        return (url.match(/\./g)) ? true : false;
    }

    logout() {
        this.is_sub_domain_url = this.checkSubDomain(window.location.hostname);
        //console.log('is_sub_domain_url',this.is_sub_domain_url);
        if(this.is_sub_domain_url) {
            //console.log('sub domain url',this.is_sub_domain_url);
            let win = (<HTMLIFrameElement>document.getElementById('mainUrlIframe')).contentWindow;
            // localStorage.removeItem('storage');
            win.postMessage(JSON.stringify({key: 'storage', method: 'remove'}), '*');
        }
        localStorage.removeItem('storage');
        localStorage.removeItem('company');
        window.location.reload();
    }
}
